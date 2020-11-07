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
}
