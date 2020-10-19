<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LaundryPrice extends Model
{
    //
    protected $fillable =
        [
            'name', 'unit_type', 'laundry_type_id',
            'price', 'user_id'
        ];

    //relasi dengan type
    public function type()
    {
        return $this->belongsTo(LaundryType::class, 'laundry_type_id', 'id');
    }

    //relasi dengan user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
