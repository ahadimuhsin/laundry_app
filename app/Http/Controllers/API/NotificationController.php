<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    //memanggil notif
    public function index()
    {
        $user = request()->user(); //mengambil data user yang sedang login

        /*
        kemudian yang diread adalah notifikasi yang statusnya belum diread
        secara langsung, kita dapat mengambil datanya melalui user dengan
        mengakses properti unreadNotification
        */
        return response()->json([
            'status' => 'success',
            'data' => $user->unreadNotifications
        ]);
    }

    //menyimpan notifikasi
    public function store(Request $request)
    {
        $user = request()->user(); //mengambil data user yang sedang login

        /*
        Ubah data notifikasi berdasarkan id yang diterima
        notifikasi yang sudah/belum diread ditandai dengan read_at yang masih null
        */

        $user->unreadNotifications()->where('id', $request->id)
        ->update(['read_at' => now()]);

        return response()->json(['status' => 'success']);
    }
}
