<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()  {
        $banners = Banner::all();
        return response()->json(array('data' => $banners));
    }

    public function show($id) {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json([
               'message' => 'Banner not found'
            ], 404);
        }
        return response()->json(array('data' => $banner));
    }

    public function store(Request $request) {
        $request->validate([
            'image' =>'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'link' =>'required|url',
        ]);
        $banner = Banner::create($request->all());
        return response()->json(['message' => 'Banner created successfully.', 'banner' => $banner]);
    }

    public function update($id, Request $request) {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json([
               'message' => 'Banner not found'
            ], 404);
        }
        $banner->update($request->all());
        return response()->json(['message' => 'Banner updated successfully.', 'banner' => $banner]);
    }
}
