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
            'price' => 'required|integer',
            'note' => 'nullable|string'
        ]);

        //ambil user yg sedang login
        $user = $request->user();

        //jika user rolenya adalah superadmin/finance, otomatis diapprove
        //selain itu, harus menunggu persetujuan
        $status = $user->role == 0 || $user->role == 2 ? 1:0;

        $request->request->add([
            'user_id' => $user->id,
            'status' => $status
        ]);

        //buat data baru expenses
        $expenses = Expense::create($request->all());

        //ambil user yg rolenya superadmin dan finance
        //hanya user inilah yang mendapatkan notifikasi

        $users = User::whereIn('role', [0,2])->get();

        Notification::send($users, new ExpensesNotification($expenses, $users));

        return response()->json(['status' => 'success']);
    }

}
