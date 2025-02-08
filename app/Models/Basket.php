<?php

namespace App\Models;

use App\Models\Product;
use App\Models\BasketItem;
use Illuminate\Database\Eloquent\Model;

class Basket extends Model
{
    public function items()
    {
        return $this->hasMany(BasketItem::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
