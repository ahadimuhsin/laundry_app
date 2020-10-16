<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    //fungsi login
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|exists:users,email',
            'password' => 'required'
        ]);

        //ada 3 value yang dikirimkan: email, password, dan remember me
        //hanya ambil email dan password karena hanya itu yg dibutuhkan
        $auth = $request->except(['remember_me']);

        //proses autentikasi
        if(Auth::attempt($auth, $request->remember_me)){
            //jika login berhasil, update kolom api_token
            Auth::user()->update(['api_token' => Str::random(60)]);

            return response()->json([
                'status' => 'success',
                'data' => Auth::user()->api_token
            ], 200);
        }

        return response()->json(['status' => 'failed']);
    }
}
