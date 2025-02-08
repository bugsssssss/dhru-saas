<?php

namespace App\Http\Controllers;

use App\Models\Callback;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CallbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'text' => 'nullable|string|max:500',
        ]);

        try {
            $callback = Callback::create([
                'name' => $request->name,
                'phone_number' => $request->phone,
                'text' => $request->text,
            ]);

            return response()->json([
                'message' => 'Callback request submitted successfully',
                'callback' => $callback
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
