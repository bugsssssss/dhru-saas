<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CallbackController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientAuthController;

// ? extends
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix("v1")->group(function () {
    // ? products 
    Route::get("/products", [ProductController::class, 'index']);
    Route::post("/products", [ProductController::class, 'create']);
    Route::get("/products/{id}", [ProductController::class, 'one']);
    Route::post("/products/{id}/image-upload", [ProductController::class,'uploadProductImages']);

    // ? categories
    Route::get("/categories", [CategoryController::class, 'index']);
    Route::get("/categories/{id}", [CategoryController::class, 'one']);
    Route::post("/categories/{id}/image-upload", [CategoryController::class, 'uploadCategoryImage']);

    // ? colors 
    Route::get("/colors", [ColorController::class, 'index']);
    Route::get("/colors/{id}", [ColorController::class, 'one']);
});


// ? clients 
Route::prefix('client')->group(function () {
    Route::post('login', [ClientAuthController::class, 'login']);
    Route::post('register', [ClientAuthController::class, 'register']);
    Route::post('logout', [ClientAuthController::class, 'logout']);
    Route::delete('delete', [ClientAuthController::class, 'delete']);
    Route::get('basket', [ClientAuthController::class, 'basket']);
    Route::get('me', [ClientAuthController::class, 'profile']);
    Route::get('orders', [ClientAuthController::class, 'orders']);
});


// ? basket 
Route::prefix("v1/basket")->group(function () {
    Route::post('add', [BasketController::class, 'addToBasket']);
    Route::post('remove', [BasketController::class, 'removeFromBasket']);
    Route::post('update', [BasketController::class, 'updateBasketItem']);
    Route::get('{clientId}', [BasketController::class, 'getBasket']);
});

// ? callbacks 
Route::prefix("callbacks")->group(function () {
    Route::post('new', [CallbackController::class, 'store']);
});


// ? orders 
Route::prefix("v1/orders")->group(function () {
    Route::post('place', [OrderController::class, 'placeOrder']);
});