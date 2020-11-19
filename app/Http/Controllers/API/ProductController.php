<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\LaundryPrice;
use App\Http\Resources\ProductCollection;
use App\LaundryType;
use Exception;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    //
    public function index()
    {
        $products = LaundryPrice::with(['type', 'user'])->orderBy('created_at', 'desc');

        if ( \request()->q != ''){
            $products = $products->where('name', 'LIKE', '%'.\request()->q. '%');
        }

        $products = $products->paginate(10);

        return new ProductCollection($products);
    }

    public function getLaundryType()
    {
        $type = LaundryType::orderBy('name', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $type
        ]);
    }

    public function storeLaundryType(Request $request)
    {
        $this->validate($request, [
            'name_laundry_type' => 'required|unique:laundry_types,name'
        ]);

        //simpan data baru ke dalam tabel laundry_types
        LaundryType::create(['name' => $request->name_laundry_type]);

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function store(Request $request){
        $this->validate($request, [
            'name' => 'required|string|max:100',
            'unit_type' => 'required',
            'price' => 'required',
            'laundry_type' => 'required',
            'service' => 'required|integer',
            'service_type' => 'required'
        ]);

        $price = $request->price;
        $price = str_replace(".","",$price);
        $price = (int)$price;

        try{
            //simpan data product ke dalam tabel laundry_prices
            LaundryPrice::create([
                'name' => $request->name,
                'unit_type' => $request->unit_type,
                'laundry_type_id' => $request->laundry_type,
                'price' => $price,
                'user_id' => auth()->user()->id,
                'service' => $request->service,
                'service_type' => $request->service_type
            ]);

            return response()->json(['status' => 'success']);
        }
        catch(Exception $e){
            return response()->json(['status' => 'failed']);
        }
    }

    public function edit($id)
    {
        $laundry = LaundryPrice::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $laundry
        ]);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => 'required|string|max:100',
            'unit_type' => 'required',
            'price' => 'required',
            'laundry_type' => 'required',
            'service' => 'required|integer',
            'service_type' => 'required'
        ]);

        $laundry = LaundryPrice::findOrFail($id);

        $price = $request->price;
        $price = str_replace(".","",$price);
        $price = (int)$price;

        //update
        $laundry->update([
            'name' => $request->name,
            'unit_type' => $request->unit_type,
            'laundry_type_id' => $request->laundry_type,
            'price' => $price,
            'service' => $request->service,
            'service_type' => $request->service_type
        ]);

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function destroy($id)
    {
        $laundry = LaundryPrice::findOrFail($id);

        $laundry->delete();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
