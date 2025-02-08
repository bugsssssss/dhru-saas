<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;

class CategoryTranslation extends Model
{
    public $timestamps = false;

    protected $fillable = ['locale', 'name', 'description'];

    public function category() {
        return $this->belongsTo(Category::class);
    }
}
