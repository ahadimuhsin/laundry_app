<?php

namespace App\Http\Controllers\API;

use App\Expense;
use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ExpensesNotification;
use App\User;

class ExpensesController extends Controller
{
    //menampilkan data expenses
    public function index()
    {
        $user = request()->user();

        $expenses = Expense::with(['user'])->orderBy('created_at', 'desc');

        //apabila ada pencarian
        if(request()->q !=''){
            //ambil data berdasarkan pencarian
            $expenses = $expenses->where('description', 'LIKE', '%'.request()->q.'%');
        }

        //ambil data user yang rolenya adalah admin dan kurir
        if(in_array($user->role, [1,3])){
            $expenses = $expenses->where('user_id', $user->id);
        }

        return (new ExpenseCollection($expenses->paginate(10)));
    }

    public function store(Request $request){
        //validasi data
        $this->validate($request, [
            'description' => 'required|string|max:150',
            'price' => 'required',
            'note' => 'nullable|string'
        ]);

        //ambil user yg sedang login
        $user = $request->user();

        //jika user rolenya adalah superadmin/finance, otomatis diapprove
        //selain itu, harus menunggu persetujuan
        $status = $user->role == 0 || $user->role == 2 ? 1:0;

        $price = $request->price;
        $price = str_replace(".","",$price);
        $price = (int)$price;

        $request->request->add([
            'user_id' => $user->id,
            'status' => $status,
            'price' => $price
        ]);

        //buat data baru expenses
        $expenses = Expense::create($request->all());

        //ambil user yg rolenya superadmin dan finance
        //hanya user inilah yang mendapatkan notifikasi

        $users = User::whereIn('role', [0,2])->get();

        Notification::send($users, new ExpensesNotification($expenses, $user));

        return response()->json(['status' => 'success']);
    }


    public function accept (Request $request)
    {
        $this->validate($request, [
            'id' => 'required|exists:expenses,id'
        ]);
        $expenses = Expense::with(['user'])->findOrFail($request->id);
        $expenses->update(['status' => 1]); //mengubah nilai status menjadi 1 (diterima)
        //mengirim notifikasi
        Notification::send($expenses->user, new ExpensesNotification($expenses, $expenses->user));
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function cancelRequest(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|exists:expenses,id',
            'reason' => 'required|string'
        ]);
        $expenses = Expense::with(['user'])->findOrFail($request->id);
        $expenses->update(['status' => 2, 'reason' => $request->reason]); //mengubah nilai status menjadi 1 (diterima)
        //mengirim notifikasi
        Notification::send($expenses->user, new ExpensesNotification($expenses, $expenses->user));
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function edit($id)
    {
        $expenses = Expense::with('user')->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $expenses
        ]);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'description' => 'required|string|max:150',
            'price' => 'required',
            'note' => 'nullable|string'
        ]);

        $expenses = Expense::findOrFail($id);
        $price = $request->price;
        $price = str_replace(".","",$price);
        $price = (int)$price;

        $expenses->update([
            'description' => $request->description,
            'price' => $price,
            'note' => $request->note
        ]);

        return response()->json([
            'status' => 'succes'
        ]);
    }

    public function destroy($id)
    {
        $expenses = Expense::findOrFail($id);
        $expenses->delete();

        return response()->json([
            'status' => 'success'
        ]);
    }

}
