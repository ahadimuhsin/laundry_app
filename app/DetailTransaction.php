<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Psy\Readline\Transient;

class DetailTransaction extends Model
{
    //
    protected $guarded = [];
    protected $dates = ['start_date', 'end_date'];
    protected $appends = ['service_time', 'status_label'];

    //buat atribut untuk service time
    public function getServiceTimeAttribute(){
        return $this->start_date->format('d-m-Y H:i:s'). 's/d'. $this->end_date->format('d-m-Y H:i:s');
    }

    //atirbut untuk label status
    public function getStatusLabelAttribute()
    {
        if($this->status == 1){
            return '<span class="label label-success">Selesai</span>';
        }
        return '<span class="label label-default">Proses</span>';
    }

    //relasi ke table transactions
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    //relasi ke laundry_prices
    public function product()
    {
        return $this->belongsTo(LaundryPrice::class, 'laundry_price_id');
    }
}
