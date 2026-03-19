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
        Schema::create('xuxemons', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del bicho
            $table->enum('type', ['Agua', 'Tierra', 'Aire']); // Solo permitimos estos 3 tipos
            $table->enum('size', ['Pequeño', 'Mediano', 'Grande']); // Los 3 tamaños
            $table->integer('level')->default(1); // Nivel inicial
            $table->integer('attack'); // Puntos de ataque
            $table->integer('defense'); // Puntos de defensa
            $table->string('image')->nullable(); // Para la imagen 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('xuxemons');
    }
};
