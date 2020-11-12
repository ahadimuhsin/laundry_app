<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //
    protected $guarded = [];

    public function detail()
    {
        //relasi one to many, artinya 1 transaksi punya banyak detail
        return $this->hasMany(DetailTransaction::class);
    }

    public function customer()
    {
        //relasi belongsto, artinya transaksi ini punya customer
        return $this->belongsTo(Customer::class);
    }

    public function payment(){
        return $this->hasOne(Payment::class);
    }
}
