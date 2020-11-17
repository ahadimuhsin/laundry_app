<?php

namespace App\Exports;

use App\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransactionExport implements FromView, ShouldAutoSize
{
    //parameter global
    protected $transaction;
    protected $month;
    protected $year;

    //meminta data transaksi, data bulan, tahun yang direquest
    public function __construct($transaction, $month, $year)
    {
        $this->transaction = $transaction;
        $this->month = $month;
        $this->year = $year;
    }

    public function view(): View
    {
        return view('exports.transactions', [
            'transaction' => $this->transaction,
            'month' => $this->month,
            'year' => $this->year
        ]);
    }
}
