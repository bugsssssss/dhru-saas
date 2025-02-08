<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Basket;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller {
    public function placeOrder(Request $request)
    {
        $client = Auth::guard("client")->user();
        $clientId = $client->id;

        if (!$client) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $basketItems = Basket::where('client_id', $clientId)->with('product')->get();

        if ($basketItems->isEmpty()) {
            return response()->json(['message' => 'Basket is empty'], 400);
        }

        $totalPrice = $basketItems->sum(function ($item) {
            return $item->product->price * $item->quantity; 
        });

        $order = Order::create([
            'client_id' => $clientId,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        foreach ($basketItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
            
            $product = $item->product;
            if ($product->stock_quantity < $item->quantity) {
                return response()->json(['message' => 'Insufficient stock for product: ' . $product->id], 400);
            }
            $product->decrement('stock_quantity', $item->quantity);
        }

        Basket::where('client_id', $clientId)->delete();

        return response()->json(['message' => 'Order placed successfully', 'order_id' => $order->id], 200);
    }

    public function deleteOrder (Request $request, $id) {

        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        };

        try {
            $order = Order::find($id)->delete();
            return redirect()->back()->withSuccess('Order deleted successfully');

        } catch (OrderNotFoundException $e) {
            return redirect()->back()->withError('Order not found');
        };

    }
}
