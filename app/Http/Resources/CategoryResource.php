<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = $request->header('Accept-Language', 'ru');
        $locales = explode('-', $locale);
        $locale = $locales[0];
        $translation = $this->translations->firstWhere('locale', $locale);
        
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $translation->name,
            'image' => asset($this->image_path), 
        ];
    }
}
