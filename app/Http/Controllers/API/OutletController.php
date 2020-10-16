<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\OutletCollection;
use App\Outlet;

class OutletController extends Controller
{
    //
    public function index()
    {
        $outlets = Outlet::orderBy('created_at', 'DESC');

        if(\request()->q != ''){
            $outlets = $outlets->where('name', 'LIKE', '%' . \request()->q.'%');
        }

        return new OutletCollection($outlets->paginate(10));
    }

    //simpan ke database
    public function store (Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:outlets,code',
            'name' => 'required|string|max:100',
            'address' => 'required|string',
            'phone' => 'required|max:13'
        ]);

        Outlet::create($request->all());
        return response()->json(['status' => 'success'], 200);
    }

    //ambil id untuk diedit
    public function edit($id)
    {
        $outlet = Outlet::where('code', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => $outlet
        ], 200);
    }

    //proses update
    public function update(Request $request, $id)
    {
        $this->validate($request, [
//            'code' => 'required|unique:outlets,code',
            'name' => 'required|string|max:100',
            'address' => 'required|string',
            'phone' => 'required|max:13'
        ]);

        $outlet = Outlet::where('code', $id)->first();
        $outlet->update($request->except('code'));

        return response()->json([
            'status' => 'success'
        ], 200);
    }

    //proses delete
    public function destroy($id)
    {
        $outlet = Outlet::findOrFail($id);
        $outlet->delete();
        return response()->json([
            'status' => 'success'
        ], 200);
    }
}
