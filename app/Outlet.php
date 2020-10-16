<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Outlet extends Model
{
    //
    protected $guarded = [];

    protected $fillable = [
        'code', 'name', 'phone', 'address'
    ];
}
