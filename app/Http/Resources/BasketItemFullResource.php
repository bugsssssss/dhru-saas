<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BasketItemFullResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $product = Product::find($this->pivot->product_id); 
    
        return [
            // "product_id" => $this->pivot->product_id,
            "product" => $product ? new ProductResource($product) : null,
            "quantity" => $this->pivot->quantity,
            "total_price" => $product ? $product->price * $this->pivot->quantity : 0,
        ];
    }
}