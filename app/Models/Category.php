<?php

namespace App\Models;

use App\Models\CategoryTranslation;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{   
    protected $fillable = ['slug','image_path']; 

    public function sex() {
        return $this->belongsTo(Sex::class);
    }

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function translations() {
        return $this->hasMany(CategoryTranslation::class, 'category_id');
    }

    public function translation($locale = null)
    {
        $locale = $locale ?: app()->getLocale();
        return $this->translations()->where('locale', $locale)->first();
    }

}
