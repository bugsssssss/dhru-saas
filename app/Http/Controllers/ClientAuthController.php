<?php

namespace App\Http\Controllers;

use App\Models\Basket;
use App\Models\Client;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\BasketItemResource;
use App\Http\Resources\BasketItemFullResource;




class ClientAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
    
        // Debugging: Log the input credentials
        \Log::info('Login attempt', ['credentials' => $credentials]);
            
        // Authenticate using the 'client' guard
        if (!$token = auth('client')->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $client = Auth::guard('client')->user();
    
        return response()->json(['token' => $token, 'data' => $client]);
    }

    public function register(Request $request)
    { 
        try {

            $validatedData = $request->validate([
                'email' => 'required|email|unique:clients,email',
                'password' => 'required|string|min:6',
                'name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:12|min:9|unique:clients,phone_number',
            ]);
            
            $client = Client::create([
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password']),
                'name' => $validatedData['name'] ?? null,
                'phone_number' => $validatedData['phone'] ?? null, 
            ]);
            
            $token = JWTAuth::fromUser($client);

            $response = [
                'message' => 'Client registered successfully',
                'token' => $token, 
                // 'client' => $client,
            ];
    
            return response()->json(['data' => $response]);

        } 
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        };
    }

    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();
    
            if (!$token) {
                return response()->json(['message' => 'Token not provided'], 401);
            }
    
            JWTAuth::setToken($token)->invalidate();
    
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['message' => 'Invalid token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['message' => 'Failed to logout, please try again'], 500);
        }
    }
    
    
    public function profile(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }
        
        $client = Auth::guard('client')->user();
        
        if (!$client) {
            return response()->json([
                'data' => null,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        
        return response()->json([
            "data" => [
                'id' => $client->id,
                'email' => $client->email,
                'name' => $client->name,
                'phone_number' => $client->phone_number,
                'basket' => BasketItemResource::collection($client->basket),
                'created_at' => $client->created_at,
            ],
            "message" => "User info"
        ]);
    }

    public function delete(Request $request)
    {
        try {
            $client = Auth::guard('client')->user();
    
            if (!$client) {
                return response()->json(['message' => 'Unauthorized or invalid token'], 401);
            }
    
            $client->delete();
    
            return response()->json(['message' => 'Client deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while deleting the client'], 500);
        }
}

    public function deleteUser($id) {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        };

        try {
            $client = Client::find($id);
            if (!$client) {
                return redirect()->back()->with('error', 'Invalid client');
            }
            $client->delete();
            return redirect()->back()->with('success', 'Client deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while deleting the client');
        }
    }

    public function basket() {
        $client = Auth::guard('client')->user();

        if (!$client) {
            return response()->json(['message' => 'Unauthorized or invalid token'], 401);
        }

        return response()->json(['data' => BasketItemFullResource::collection($client->basket)]);
    }


    public function orders() {
        $client = Auth::guard('client')->user();

        if (!$client) {
            return response()->json(['message' => 'Unauthorized or invalid token'], 401);
        }

        return response()->json(['data' => OrderResource::collection($client->orders)]);
    }
}
