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
        Schema::create('color_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('color_id');
            $table->string('locale', 10); // Language code (e.g., 'en', 'fr')
            $table->string('name');
            $table->text('description')->nullable();

            $table->timestamps();

            $table->foreign('color_id')->references('id')->on('colors')->onDelete('CASCADE');
            $table->unique(['color_id', 'locale']); // Ensure one translation per language per category
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('color_translations');
    }
};
