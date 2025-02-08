<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Http\Controllers\ColorController;
use App\Http\Resources\ColorResource;

class ColorController extends Controller
{
    public function index() {
        $colors = Color::with('translations')->get();
        return response()->json(array('data' => ColorResource::collection($colors)));
    }

    public function one($id) {
        $color = Color::with('translations')->where('id', $id)->first();
        if (!$color) {
            return response()->json([
                'message' => 'Color not found'
            ], 404);
        }
        return response()->json(array('data' => new ColorResource($color)));
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'translations' => 'required|array',
            'translations.*.locale' => 'required|string|max:5',
            'translations.*.name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:colors,slug,' . $id,
        ]);
    
        // Find the color by ID
        $color = Color::with('translations')->findOrFail($id);
        $color->slug = $validated['slug'];
        $color->save();

        // Process translations
        foreach ($validated['translations'] as $translation) {
            $existingTranslation = $color->translations()->where('locale', $translation['locale'])->first();
            if ($existingTranslation) {
                $existingTranslation->update([
                    'name' => $translation['name'],
                ]);
            } else {
                $color->translations()->create($translation);
            }
        }
    
        return redirect()->back()->withSuccess('Color updated successfully');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'translations' => 'required|array',
            'translations.*.locale' => 'required|string|max:5',
            'translations.*.name' => 'required|string|max:255',
           'slug' =>'required|string|max:255|unique:colors',
        ]);

        $color = Color::create([
           'slug' => $validated['slug'],
        ]);

        foreach ($validated['translations'] as $translation) {
            $color->translations()->create($translation);
        }
        return redirect()->back()->withSuccess('Color created successfully');
    }

    public function destroy($id) {
        $color = Color::with('translations')->findOrFail($id);
        $color->delete();
        return redirect()->back()->withSuccess('Color deleted successfully');
    }
    
}
