<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo'); // 'xuxe' (apilable) o 'vacuna' (no apilable)
            $table->string('icono')->default('🍬');
            $table->integer('max_stack')->default(5);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('items');
    }
};
