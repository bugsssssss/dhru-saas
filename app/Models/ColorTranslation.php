<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ColorTranslation extends Model
{
    public $timestamps = false;

    protected $fillable = ['locale', 'name'];

    public function color() {
        return $this->belongsTo(Color::class);
    }
}
