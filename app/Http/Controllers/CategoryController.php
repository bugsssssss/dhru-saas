<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request) {
        $locale = $request->header('Accept-Language', 'en');
        $locales = explode('-', $locale);
        $locale = $locales[0];

        $sex = $request->query("sex");

        $categories = Category::with('translations')
        ->when($sex, function ($query) use ($sex) {
            return $query->where('sex_id', $sex);
        })
        ->get();
        ;

        $response = $categories->map(function ($category) use ($locale) {
            $translation = $category->translations->last();

            return [
                'id' => $category->id,
                'slug'=>$category->slug,
                'name' => $translation->name ?? null,
                'image'=>Storage::url($category->image_path) ?? null,
                // 'sex'=>$category->sex->name
            ];
        });

        return response()->json(array('data' => $response));
    }

    public function one($id, Request $request) {
        $locale = $request->header('Accept-Language', 'en');
        $locales = explode('-', $locale);
        $locale = $locales[0];
        
        $category = Category::with([
            'translations' => function ($query) use ($locale) {
                $query->where('locale', $locale);
            },
           'sex',
        ])
        ->find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        $response = [
            'id' => $category->id,
           'slug' => $category->slug,
            'name' => $category->translations->last()->name,
            'image' => Storage::url($category->image_path) ?? null,
            // 'sex' => $category->sex->name,
        ];

        return response()->json(array('data' => $response));
    }

    public function uploadCategoryImage(Request $request, $categoryId)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // ? Max size: 2MB
        ]);
    
        $category = Category::findOrFail($categoryId);
    
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path); // Delete old image
        }
    
        $path = $request->file('image')->store('category_images', 'public'); // Store in "storage/app/public/category_images"
        $category->update(['image_path' => $path]);
    
        return response()->json(['message' => 'Category image uploaded successfully.']);
    }

    public function destroy($id) {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        $category->delete();

        return redirect()->back()->withSuccess('Category deleted successfully');
    }
    public function update($id, Request $request)
    {   
        try {
        $validated = $request->validate([
            'slug' => 'string|max:255|unique:categories,slug,' . $id,
            'translations' => 'required|array',
            'translations.*.locale' => 'required|string|max:5',
            'translations.*.name' => 'required|string|max:255',
            'translations.*.description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // Max 10MB
            'sex_id' => 'nullable|integer|exists:sexes,id', 
        ]);
        } 
        catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        $category = Category::with('translations')->findOrFail($id);
    
        $category->slug = $validated['slug'];
        $category->sex_id = $validated['sex_id']; 

        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($category->image_path) {
                Storage::delete($category->image_path);
            }
    
            $path = $request->file('image')->store('category_images', 'public');
            $category->image_path = $path;
        }
    
        // Save the category
        $category->save();
    
        // Update translations
        foreach ($validated['translations'] as $translation) {
            $category->translations()->updateOrCreate(
                ['locale' => $translation['locale']], // Match on locale
                [
                    'name' => $translation['name'],
                    'description' => $translation['description'] ?? null,
                ]
            );
        }
    
        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category->load('translations'), // Return updated category with translations
        ]);
    }
    public function store(Request $request)
{
    $validated = $request->validate([
        'slug' => 'required|string|max:255|unique:categories',
        'sex_id' => 'required|integer|exists:sexes,id', // Adjust based on your database
        'translations' => 'required|array|min:1',
        'translations.*.locale' => 'required|string|max:5',
        'translations.*.name' => 'required|string|max:255',
        'translations.*.description' => 'nullable|string|max:500',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240', // 10MB max
    ]);

    // Create the category
    $category = new Category();
    $category->slug = $validated['slug'];
    $category->sex_id = $validated['sex_id'];

    // Handle image upload
    if ($request->hasFile('image')) {
        $category->image_path = $request->file('image')->store('categories', 'public');
    }

    $category->save();

    // Handle translations
    foreach ($validated['translations'] as $translation) {
        $category->translations()->create([
            'locale' => $translation['locale'],
            'name' => $translation['name'],
            'description' => $translation['description'] ?? null,
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Category created successfully!',
        'category' => $category,
    ]);
}
}
