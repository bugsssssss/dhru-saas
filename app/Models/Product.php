<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'sex_id', 'price', 'category_id', 'color_id', 'description'];

    public function sex() {
        return $this->belongsTo(Sex::class);
    }

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
    // public function images() {
    //     return $this->hasMany(Image::class);
    // }

}
