<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    
    public $timestamps = false;

    protected $fillable = ['locale', 'name', 'description'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
