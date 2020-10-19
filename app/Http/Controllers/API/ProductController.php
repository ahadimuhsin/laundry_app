<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\LaundryPrice;
use App\Http\Resources\ProductCollection;

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
}
