<?php

namespace App\Http\Controllers\API;

use App\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\CustomerCollection;

class CustomerController extends Controller
{
    //
    public function index()
    {
        $customers = Customer::with(['courier'])->orderBy('created_at', 'desc');
        //jika user mengirimkan form pencarian
        if(request()->q != '')
        {
            $customers = $customers->where('name', 'LIKE', '%'.request()->q.'%');
        }

        return new CustomerCollection($customers->paginate(10));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'nik' => 'required|string|unique:customers,nik',
            'name' => 'required|string|max: 150',
            'address' => 'required|string',
            'phone' => 'required|string|max:15'
        ]);
        //ambil user yang sedang login
        $user = $request->user();

        //defaultnya point dan deposit 0
        $request->request->add([
            'point' => 0,
            'deposit' => 0]);

        //jika diinput oleh kurir
        if($user->role == 3){
            $request->request->add(['courier_id' => $user->id]);
        }

        Customer::create($request->all());

        return response()->json(['status' => 'success']);
    }

    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $customer
        ]);
    }

    public function update(Request $request, $id){
        $this->validate($request, [
            'name' => 'required|string|max:150',
            'address' => 'required|string',
            'phone' => 'required|string|max:15'
        ]);

        $customer = Customer::findOrFail($id);
        $customer->update($request->all());

        return response()->json(['status' => 'success']);
    }

    public function destroy ($id)
    {
        $customer= Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['status' => 'success']);
    }
}
