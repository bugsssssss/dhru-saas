<?php

use App\Models\Sex;
use App\Models\Size;
use Inertia\Inertia;
use App\Models\Color;
use App\Models\Order;
use App\Models\Client;
use App\Models\Product;
use App\Models\Callback;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientAuthController;

Route::get('/', function () {
// return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => false,
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
    return redirect('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ? 
Route::prefix("admin")->group(function () {
    Route::get("/products", function () {
        $products = Product::with('sizes', 'category.sex', 'color', 'translations')
        ->orderBy('created_at', 'desc')
        ->get();
        return Inertia::render('Products', compact('products'));
    })->name('products');

    Route::get('/products/{id}', function ($id) {
        $product = Product::with('sizes', 'category.sex', 'color', 'translations', 'images')
        ->where('id', $id)
        ->first();
        $categories = Category::with("translations")->get(); // Assuming you have a Category model
        $sizes = Size::all(); // Assuming you have a Size model
        $colors = Color::with('translations')->get(); // Example for colors

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'categories' => $categories,
            'sizes' => $sizes,
            'colors' => $colors,
        ]);
    });
    Route::get('/products/add', function () {
        $categories = Category::all(); // Assuming you have a Category model
        $sizes = Size::all(); // Assuming you have a Size model
        $colors = Color::all(); // Example for colors
        return Inertia::render('ProductForm', [
            'categories' => $categories,
            'sizes' => $sizes,
            'colors' => $colors,
        ]);
    });
    Route::post('/products/store', [ProductController::class,'store'])->name('products.store');
    Route::post('/products/{id}/update', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/images/{id}', function ($id) {
        try {
            $productImage = ProductImage::find($id);
            $productImage->delete();
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    })->name("product-image-delter");

    Route::get("/clients", function () {
        $clients = Client::orderBy('created_at', 'desc')->get();
        return Inertia::render('Clients', compact('clients'));
    })->name('clients');

    Route::get('/clients/{id}', function ($id) {
        $client = Client::with('orders', 'orders.items.product')->where('id', $id)->first();
        return Inertia::render('ClientDetail', compact('client'));
    });

    Route::delete('clients/delete/{id}', [ClientAuthController::class, 'deleteUser']);

    Route::get("callbacks", function () {
        $callbacks = Callback::orderBy('created_at', 'desc')->get();
        return Inertia::render('Callbacks', compact('callbacks'));
    })->name('callbacks');

    Route::get('orders', function () {
        $orders = Order::with('client', 'items.product') 
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($order) {
            // Calculate the total price
            $order->total_price = $order->items->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });
            return $order;
        });
        return Inertia::render('Orders', compact('orders'));
    })->name("orders");

    Route::get("orders/{id}", function ($id) {
        $order = Order::with('client', 'items.product', 'items.product.translations') 
        ->where('id', $id)
        ->first();
        return Inertia::render('OrderDetail', compact('order'));
    });

    Route::delete("orders/{id}", [OrderController::class, 'deleteOrder']);
    

    Route::get("/categories", function () {
        $categories = Category::with('sex', 'translations')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Categories', compact('categories'));
    })->name('categories');

    Route::get('/categories/{id}', function ($id) {
        $category = Category::with('sex', 'translations', 'products.translations', 'products.images')
        ->where('id', $id)
        ->first();
        return Inertia::render('CategoryDetail', compact('category'));
    })->name('categories-one');
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    Route::post('/categories/{id}/update', [CategoryController::class, 'update'])->name('categories.update');
    Route::post('/categories/store', [CategoryController::class,'store'])->name('categories.store');

    Route::get("colors", function () {
        $colors = Color::with('translations')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Colors', compact('colors'));
    })->name('colors');

    Route::get('/colors/{id}', function ($id) {
        $color = Color::with('translations')->where('id', $id)->first();
        return Inertia::render('ColorForm', compact('color'));
    })->name('colors-one');

    Route::get('colors/add', function () {
        return Inertia::render('ColorForm');
    })->name('colors-add');

    Route::delete('colors/{id}', [ColorController::class, 'destroy']);
    Route::post('/colors/{id}/update', [ColorController::class, 'update'])->name('colors.update');
    Route::post('/colors/store', [ColorController::class,'store'])->name('colors.store');

});

// Route::prefix("api/v1")->group(function () {
//     Route::get("/products", [ProductController::class, 'index']);
//     Route::get("/products/{id}", [ProductController::class, 'one']);
//     Route::post("/products/{id}/image-upload", [ProductController::class,'uploadProductImages']);
//     Route::get("/categories", [CategoryController::class, 'index']);
//     Route::post("/categories/{id}/image-upload", [CategoryController::class, 'uploadCategoryImage']);
// });
// ?

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';