<?php

namespace App\Models;

use App\Models\Size;
use App\Models\Color;
use App\Models\Client;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\ProductTranslation;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'color_id', 'price', 'stock_quantity',
    ];
    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_size');
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }
    
    public function color() {
        return $this->belongsTo(Color::class);
    }
    
    public function translations() {
        return $this->hasMany(ProductTranslation::class, 'product_id');
    }

    public function translation($locale = null)
    {
        $locale = $locale ?: app()->getLocale();
        return $this->translations()->where('locale', $locale)->first();
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'baskets')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function baskets()
    {
            return $this->hasMany(Basket::class);
    }

    public function getTotalPrice() {
        return $this->price * $this->pivot->quantity;
    }
    
}
