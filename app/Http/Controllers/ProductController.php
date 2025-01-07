<?php

namespace App\Http\Controllers;

use App\Models\Sex;
use App\Models\Size;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    public function index() {
        $products = Product::with('sex', 'sizes', 'category', 'color')->get();
        $sizes = Size::all();
        $sexes = Sex::all();

        return response()->json([
            'products' => $products,
            'sizes' => $sizes,
            'sexes' => $sexes,
        ]);
    }
}
