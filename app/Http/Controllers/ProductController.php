<?php

namespace App\Http\Controllers;

use App\Models\Sex;
use App\Models\Size;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{

    public function index(Request $request)
    {
        $locale = $request->header('Accept-Language', 'en');
        $limit = $request->query('limit', 25);
        $categoryId = $request->query('category_id');

        $products = Product::with([
            'translations' => function ($query) use ($locale) {
                $query->where('locale', $locale);
            },
            'sizes',
            'category.sex',
            'images', 
            'color'
        ])
        ->when($categoryId, function ($query) use ($categoryId) {
            return $query->where('category_id', $categoryId);
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get();
    
        return response()->json([
            'data' => ProductResource::collection($products),
        ]);
    }

    public function one($id, Request $request) {
        $locale = $request->header('Accept-Language', 'en');
        $locales = explode('-', $locale);
        $locale = $locales[0]; 
    
        $product = Product::with([
            'translations' => function($query) use ($locale) {
                $query->where('locale', $locale);
            },
            'sizes',
            'category',
            'color',
            'images',
        ])->find($id);
    
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }
    
        $translation = $product->translations->first();


        return response()->json(array("data" => new ProductResource($product)));
    }

    public function create(Request $request)
    {
        $client = Auth::guard("client")->user();

        if (!$client) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        try {
            $request->validate([
                'translations' => 'required|array',
                'translations.*.name' => 'required|string',
                'translations.*.description' => 'nullable|string',
                'images' => 'array|nullable',
                'images.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048',
                'category_id' => 'required|integer|exists:categories,id',
                'color_id' => 'required|integer|exists:colors,id',
                // 'stock_quantity'=> 'integer',
                'price' => 'required|numeric',
                'sizes' => 'required|array',
                'sizes.*' => 'required|integer|exists:sizes,id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    
        DB::beginTransaction();
    
        try {
            $product = Product::create([
                'category_id' => $request->category_id,
                'color_id' => $request->color_id,
                'price' => $request->price,
                // 'stock_quantity' => $request->stock_quantity,
            ]);
    
            foreach ($request->translations as $translation) {
                $product->translations()->create([
                    'locale' => $translation['locale'],
                    'name' => $translation['name'],
                    'description' => $translation['description'] ?? null,
                ]);
            }
    
            $product->sizes()->attach($request->sizes);

            if ($request->hasFile('images')) {
                foreach ($request->images as $image) {
                    $path = $image->store('products/images', 'public');
                    $product->images()->create([
                        'image_path' => $path,
                    ]);
                }
            }
    
    
            DB::commit();
    
            return response()->json([
                'message' => 'Product created successfully.',
                'product' => new ProductResource($product),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
    
            return response()->json([
                'message' => 'Failed to create product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function update($id, Request $request)
    {   
        try {
            $request->validate([
                'translations.*.locale' => 'required|string|in:en,ru,uz', // Validate locale
                'translations.*.name' => 'required|string',
                'translations.*.description' => 'nullable|string',
                'images' => 'array|nullable',
                'images.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048', // Validate images
                'category_id' => 'required|integer|exists:categories,id', // Category validation
                'color_id' => 'required|integer|exists:colors,id', // Color validation
                'price' => 'required|numeric', // Price validation
                'sizes' => 'required|array', // Sizes validation
                'sizes.*' => 'required|integer|exists:sizes,id', // Size validation
            ]);
        } 
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
               'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
        $product = Product::with(['translations', 'images', 'sizes'])->find($id);

        // Update category and color
        $product->category_id = $request->category_id;
        $product->color_id = $request->color_id;
        $product->price = $request->price;
    
        foreach ($request->translations as $translation) {
            $existingTranslation = $product->translations()->where('locale', $translation['locale'])->first();
            
            if ($existingTranslation) {
                $existingTranslation->update([
                    'name' => $translation['name'],
                    'description' => $translation['description'],
                ]);
            } else {
                $product->translations()->create([
                    'locale' => $translation['locale'],
                    'name' => $translation['name'],
                    'description' => $translation['description'],
                ]);
            }
        }
    
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public'); // Save to public storage
                $product->images()->create(['image_path' => $path]);
            }
        }
    
        $product->sizes()->sync($request->sizes);
    
        $product->save();
    
        return redirect()->route('products')->with('success', 'Product updated successfully!');
    }
    
    public function uploadProductImages(Request $request, $id) {
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                \Log::info('Processing image:', ['image' => $image]);
                // Ensure the image is valid
                if ($image->isValid()) {
                    $path = $image->store('product_images', 'public'); // Save to storage
                    \Log::info('Image stored at:', ['path' => $path]);
                    
                    // Create ProductImage instance
                    ProductImage::create([
                        'product_id' => $id,
                        'image_path' => $path
                    ]);
                } else {
                    \Log::error('Invalid image:', ['image' => $image]);
                }
            }
            return response()->json(['message' => 'Images uploaded successfully.']);
        } else {
            \Log::error('No files found in the request');
            return response()->json(['message' => 'No images provided'], 400);
        }
    }
    
}
