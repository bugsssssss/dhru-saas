<?php

namespace App\Models;

use App\Models\ColorTranslation;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable = [
        'slug',
    ];
    public function translations() {
        return $this->hasMany(ColorTranslation::class, 'color_id');
    }

    public function translation($locale = null)
    {
        $locale = $locale ?: app()->getLocale();
        return $this->translations()->where('locale', $locale)->first();
    }

}
