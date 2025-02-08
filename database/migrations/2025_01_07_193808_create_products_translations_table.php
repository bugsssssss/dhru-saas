<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('locale', 10); // Language code (e.g., 'en', 'fr')
            $table->string('name');
            $table->text('description')->nullable();

            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('CASCADE');
            $table->unique(['product_id', 'locale']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_translations');
    }
};


 