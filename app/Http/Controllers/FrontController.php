<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontController extends Controller
{
    //menampilkan halaman awal
    public function index()
    {
        return view('index');
    }
}
