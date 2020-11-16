<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    //
    public function chart()
    {
        $filter = request()->year.'-'.request()->month; //ambil data bulan & tahun dari parameter

        //ubah formatnya menjadi format carbon
        $parse = Carbon::parse($filter);

        //buat range tanggal pada bulan terkait
        $array_date = range($parse->startOfMonth()->format('d'), $parse->endOfMonth()->format('d'));

        //get data transaksi berdasarkan bulan dan tanggal yang diminta
        //kelompokkan berdasarkan tanggalnya
        //sum data amount dan simpan ke nama baru
        $transaction = Transaction::select(DB::raw('date(created_at) as date, sum(amount) as total'))
        ->where('created_at', 'LIKE', '%'.$filter.'%')
        ->groupBy(DB::raw('date(created_at)'))->get();

        $data = [];
        //looping range tanggal bulan saat ini
        foreach($array_date as $row)
        {
            //cek tanggalnya, jika hanya 1 angka, tambahkan 0 di depannya
            // $f_date = strlen($row) == 1 ? 0. $row : $row;
            if (strlen($row) == 1){
                $f_date = 0 . $row;
            }else{
                $f_date = $row;
            }
            $date = $filter.'-'.$f_date;
            //cari berdasarkan date pada collection hasil query
            $total = $transaction->firstWhere('date', $date);

            //simpan datanya ke variabel data
            $data[] = [
                'date' => $date,
                'total' => $total ? $total->total : 0
            ];
        }
        return $data;
    }
}
