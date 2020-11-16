<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //
    protected $guarded = [];

    protected $appends = ['status_label'];

    public function getStatusLabelAttribute(){
        //jika statusnya 1
        if($this->status == 1){
            //maka valuenya adalah html yang berisi label success
            return '<span class="label label-success">Selesai</span>';
        }
        //selain itu menampilkan label primary
        return '<span class="label label-primary">Proses</span>';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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
