<?php

use App\Models\Sex;
use App\Models\Size;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => false,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::prefix("admin")->group(function() {
    Route::get("/products", function () {
        $products = Product::with('sex', 'sizes', 'category', 'color')->get();
        $sizes = Size::all();
        $sexes = Sex::all();
        return Inertia::render('Products', compact('products', 'sexes', 'sizes'));

    })->middleware(['auth', 'verified'])->name('products');

    
})->middleware(['auth', 'verified'])->name('admin');



Route::prefix("api/v1/")->group(function(){
    Route::get('/products', [ProductController::class, 'index']);

});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
