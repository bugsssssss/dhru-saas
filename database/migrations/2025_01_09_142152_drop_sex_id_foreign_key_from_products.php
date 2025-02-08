<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the sex_id column directly, no foreign key drop needed
            $table->dropColumn('sex_id');
        });
    }
    
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Add the sex_id column back
            $table->unsignedInteger('sex_id')->nullable();
        });
    }
};
