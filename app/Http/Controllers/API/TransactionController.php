<?php

namespace App\Http\Controllers\API;

use App\DetailTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Transaction;
use Illuminate\Support\Carbon;

class TransactionController extends Controller
{
    //
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
            return response()->json(['status' => 'success']);
        }
        catch(\Exception $e){
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage()
            ]);
        }
    }
}
