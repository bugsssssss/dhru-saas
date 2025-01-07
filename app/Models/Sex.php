<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sex extends Model
{   
    protected $fillable = ['name'];

    public function products() {
        return $this->hasOne(Product::class);
    }
}
