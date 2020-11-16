<?php

namespace App\Http\Controllers\API;

use App\DetailTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Transaction;
use Exception;
use Illuminate\Support\Carbon;
use App\Payment;
use App\Http\Resources\TransactionCollection;

class TransactionController extends Controller
{
    //
    public function index()
    {
        $search = request()->q; //keyword pencarian
        $user = request()->user(); //ambil user yang sedang login

        //whereHas digunakan untuk memfilter nama customer yang dicari user,
        //tetapi nama tersebut berada pada tabel customer
        //parameter pertama dari where Has adalah nama relasi yang didefinisikan
        //di dalam model
        $transaction = Transaction::with(['user', 'detail', 'customer'])
        ->orderBy('created_at', 'desc')->whereHas('customer', function($q) use($search){
            $q->where('name', 'LIKE', '%'.$search.'%');
        });

        //jika filternya adalah 0 dan 1, dimana 0 = proses, 1 = selesai dan 2 = semua data
        if(in_array(request()->status, [0,1])){
            //ambil data berdasarkan status tersebut
            $transaction = $transaction->where('status', request()->status);
        }

        //jika rolenya bukan superadmin
        if($user->role != 0){
            //user hanya kana mendapatkan transaksi miliknya saja
            $transaction =$transaction->where('user_id', $user->id);
        }

        $transaction = $transaction->paginate(10);

        return new TransactionCollection($transaction);
    }

    public function store(Request $request){
        $this->validate($request, [
            'customer_id' => 'required',
            'detail' => 'required'
        ]);

        //menggunakan database transaction
        DB::beginTransaction();
        try{
            $user = $request->user(); //ambil user yg sedang login
            //buat data transaksi
            $transaction = Transaction::create([
                'customer_id' => $request->customer_id['id'],
                'user_id' => $user->id,
                'amount' => 0
            ]);

            $amount = 0;
            //karena datanya lebih dari satu, lakukan looping
            foreach($request->detail as $row){
                if(!is_null($row['laundry_price'])){
                    //perhitungan kembali dari sisi backend untuk menentukan subtotal
                    $subtotal = $row['laundry_price']['price'] * $row['qty'];
                    if($row['laundry_price']['unit_type'] == 'Kilogram'){
                        $subtotal = $row['laundry_price']['price']*($row["qty"]/1000);
                    }

                    $start_date = Carbon::now();
                    //secara default, end date menggunakan addHours
                    $end_date = Carbon::now()->addHours($row['laundry_price']['service']);

                    //jika servicenya adalah hari, end date diganti dengan addDays
                    if ($row['laundry_price']['service_type'] == 'Hari'){
                        $end_date = Carbon::now()->addDays($row['laundry_price']['service']);
                    }

                    //menyimpan detail transaksi
                    DetailTransaction::create([
                        'transaction_id' => $transaction->id,
                        'laundry_price_id' => $row['laundry_price']['id'],
                        'laundry_type_id' => $row['laundry_price']['laundry_type_id'],
                        'qty' => $row['qty'],
                        'price' => $row['laundry_price']['price'],
                        'subtotal' => $subtotal,
                        'start_date' => $start_date->format('Y-m-d H:i:s'),
                        'end_date' => $end_date->format('Y-m-d H:i:s')
                    ]);

                    $amount += $subtotal;
                }

            }
            //update informasi pada tabel transactions
            $transaction->update(['amount' => $amount]);
            DB::commit();
            return response()->json(['status' => 'success', 'data' => $transaction]);
        }
        catch(\Exception $e){
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage()
            ]);
        }
    }

    public function edit($id){
        //mencari id transaksi terkait yang terhubung dengan
        //customer, payment, detail, dan detail.product
        $transaction = Transaction::with(['customer', 'payment', 'detail', 'detail.product'])->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $transaction]);
    }

    public function completeItem(Request $request)
    {
        //validasi untuk memeriksa idnya ada atau tidak
        $this->validate($request, [
            'id' => 'required|exists:detail_transaction,id'
        ]);

        //load data detail transaksi berdasarkan ID
        $transaction = DetailTransaction::with(['transaction.customer'])->findOrFail($request->id);

        //update status detail transaksi menjadi 1
        $transaction->update(['status' => 1]);

        //update data customer terkait dengan menambahkan 1 point
        $transaction->transaction->customer()->update(['point' => $transaction->transaction->customer->point + 1]);

        return response()->json(['status'=>'success']);
    }

    public function makePayment(Request $request)
    {
        $this->validate($request, [
            'transaction_id' => 'required|exists:transactions,id',
            'amount' => 'required|integer'
        ]);

        DB::beginTransaction();
        try{
            //cari transaksi berdasarkan ID
            $transaction = Transaction::findOrFail($request->transaction_id);

            //set defaul kembalian = 0
            $customer_change = 0;

            //lakukan pengecekan, jika via_deposit true
            if($request->via_deposit){
                //cek lagi, jika deposit customer kurang dari total tagihna
                if($transaction->customer->deposit < $request->amount){
                    //kirim pembayaran tidak bisa dilanjutkan
                    return response()->json([
                        'status' => 'error',
                        'data' => 'Deposit tidak cukup'
                    ]);
                }
                //selain itu, perbarui deposit customer
                $transaction->customer()->update(['deposit' => $transaction->customer->deposit - $request->amount]);
            }
            //jika bayar via cash
            else{
                if($request->customer_change){
                    //jika customer change bernilai true
                    $customer_change = $request->amount - $transaction->amount; //hitung berapa kembaliannya

                    //tambahkan ke deposit customer
                    $transaction->customer()->update(['deposit' => $transaction->customer->deposit + $customer_change]);
                }
            }


            //simpan info pembayaran
            Payment::create([
                'transaction_id' => $transaction->id,
                'amount' => $request->amount,
                'customer_change' => $customer_change,
                'type' => $request->via_deposit
            ]);
            //update status transaski jadi 1, artinya udah bayar
            $transaction->update(['status' => 1]);

            //kalo gak ada error, commit perubahan
            DB::commit();
            return response()->json(['status' => 'success']);
        }
        catch(Exception $e){
            return response()->json([
                'status' => 'failed',
                'data' => $e->getMessage()
            ]);
        }
    }
}
