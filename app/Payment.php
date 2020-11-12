<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //
    protected $guarded = [];
    protected $appends = ['type_label']; //append ke json object

    //buat atribut
    public function getTypeLabelAttribute()
    {
        if($this->type == 0)
        {
            return 'Cash';
        }
        return 'Deposit';
    }
}
