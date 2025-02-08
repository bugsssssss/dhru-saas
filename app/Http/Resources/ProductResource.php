<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\SizeResource;
use App\Http\Resources\ColorResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductImageResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $locale = $request->header('Accept-Language', 'ru');
        $locales = explode('-', $locale);
        $locale = $locales[0];
        $translation = $this->translations->firstWhere('locale', $locale);

        return [
            'id' => $this->id,
            'name' => $translation->name ?? null,
            'description' => $translation->description ?? null,
            'sex' => $this->category->sex->name ?? null,
            'category' => new CategoryResource($this->category),
            'color' => new ColorResource($this->color),
            'sizes' => SizeResource::collection($this->sizes),
            'price' => $this->price,
            'images' => $this->images->map(fn($image) => [
                'url' => Storage::url($image->image_path),
            ]),
        ];
    }
}
