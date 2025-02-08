<?php

namespace App\Models;

use App\Models\Product;
use Tymon\JWTAuth\Contracts\JWTSubject;  // Only needed for JWT
use Illuminate\Foundation\Auth\User as Authenticatable;  // This makes the model compatible with authentication

class Client extends Authenticatable implements JWTSubject  // Use JWTSubject if using JWT
{
    protected $fillable = ['email', 'password', 'name', 'phone_number'];
    /**
     * Get the identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Get the JWT identifier for the client.
     *
     * @return string
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Get the JWT custom claims for the client.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function basket()
    {
        return $this->belongsToMany(Product::class, 'baskets')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
    
    public function basketItems()
    {
        return $this->hasMany(BasketItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }


}
