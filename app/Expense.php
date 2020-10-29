<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    //
    protected $guarded =[];

    //relasi dengan user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
