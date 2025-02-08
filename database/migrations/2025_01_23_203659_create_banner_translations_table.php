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
        Schema::create('banner_translations', function (Blueprint $table) {

            $table->id();
            $table->unsignedBigInteger('banner_id');
            $table->string('locale', 10);
            $table->string('name');

            $table->text('description')->nullable();
            $table->timestamps();


            $table->foreign('banner_id')->references('id')->on('banners')->onDelete('CASCADE');
            $table->unique(['banner_id', 'locale']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_translations');
    }
};
