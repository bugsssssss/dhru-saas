<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BasketItemResource extends JsonResource {

    public function toArray($request) {
        return [
            "product_id" => $this->id,
            "quantity" => $this->pivot->quantity,
            "total_price" => $this->price * $this->pivot->quantity,
        ];
    }
}