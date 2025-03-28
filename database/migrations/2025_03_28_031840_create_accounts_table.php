<?php

use App\Enums\AccountStatusEnum;
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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id()->startingValue(4000);

            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('game_id')->constrained('games')
            ->cascadeOnDelete();

            $table->text('description');

            $table->decimal('price', 11, 2);
            $table->integer('status');

            $table->jsonb('features');

            $table->timestamps();

            $table->index('status');
            $table->index(['game_id', 'seller_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
