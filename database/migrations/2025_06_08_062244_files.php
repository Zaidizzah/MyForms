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
        Schema::table('files', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->dropColumn('extension');
            $table->enum('file_extension', ['jpg', 'jpeg', 'png', 'webp', 'gif'])->after('file_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn('user_id');
            $table->enum('extension', ['jpg', 'jpeg', 'png', 'webp', 'gif'])->after('file_type')->change();
        });
    }
};
