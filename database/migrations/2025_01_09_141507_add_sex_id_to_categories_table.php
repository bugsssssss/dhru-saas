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
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedBigInteger('sex_id')->nullable()->after('id'); // Adjust the column type and position if necessary
            $table->foreign('sex_id')->references('id')->on('sexes')->onDelete('set null'); // Assuming you have a `sexes` table
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['sex_id']);
            $table->dropColumn('sex_id');
        });
    }
};
