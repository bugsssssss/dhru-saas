<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BasketItemResource;

class BasketController extends Controller
{
    
    public function addToBasket(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);
    
        try {
            $client = Auth::guard('client')->user();
    
            if (!$client) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
    
            $productId = $request->input('product_id');
            $quantity = $request->input('quantity', 1);
    
            $product = Product::findOrFail($productId);
    
            $basketItem = $client->basket()->where('product_id', $productId)->first();
    
            if ($basketItem) {
                $client->basket()->updateExistingPivot($productId, ['quantity' => $basketItem->pivot->quantity + $quantity]);
            } else {
                $client->basket()->attach($productId, ['quantity' => $quantity]);
            }
    
            
            return response()->json([
                'message' => 'Product added to basket successfully',     
                'basket' => BasketItemResource::collection($client->basket)
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
    
    public function removeFromBasket(Request $request)
    {
        $client = Auth::guard('client')->user();
    
        if (!$client) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);
    
        $productId = $request->input('product_id');
        $quantityToRemove = $request->input('quantity', 1); 


    
        $basketItem = $client->basket()->where('product_id', $productId)->first();
    
        if (!$basketItem) {
            return response()->json(['message' => 'Product not found in the basket'], 404);
        }
    
        $currentQuantity = $basketItem->pivot->quantity;
    
        if ($quantityToRemove == -1) {
            $client->basket()->detach($productId);
            return response()->json(['message' => 'Product removed from basket'], 200);
        }

        if ($currentQuantity > $quantityToRemove) {
            $client->basket()->updateExistingPivot($productId, [
                'quantity' => $currentQuantity - $quantityToRemove
            ]);
        } else {
            $client->basket()->detach($productId);
        }
    
        return response()->json([
            'message' => 'Product removed from basket',
        ], 200);
    }
    
    public function getBasket($clientId)
    {
        $client = Client::with(['basket' => function ($query) {
            $query->withPivot('quantity');
        }])->findOrFail($clientId);
        return $client->basket->map(function ($product) {
            return [
                'product_id' => $product->id,
                'name' => $product->name ?? 'N/A',
                'price' => $product->price,
                'quantity' => $product->pivot->quantity,
                'total_price' => $product->price * $product->pivot->quantity,
            ];
        });
    }

}
