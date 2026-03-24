<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Xuxemon; 

class XuxemonSeeder extends Seeder
{
    public function run(): void
    {
        // Nuestro catálogo oficial de Xuxemons con los nombres de columna CORRECTOS
        $xuxemons = [
            ['nombre' => 'Floppi', 'tipo' => 'Tierra', 'tamano' => 'Pequeño', 'nivel' => 5, 'ataque' => 40, 'defensa' => 50, 'user_id' => 1],
            ['nombre' => 'Charmander', 'tipo' => 'Aire', 'tamano' => 'Mediano', 'nivel' => 18, 'ataque' => 70, 'defensa' => 45, 'user_id' => 1],
            ['nombre' => 'Squirtle', 'tipo' => 'Agua', 'tamano' => 'Pequeño', 'nivel' => 10, 'ataque' => 45, 'defensa' => 60, 'user_id' => 1],
            ['nombre' => 'Bulbasaur', 'tipo' => 'Tierra', 'tamano' => 'Mediano', 'nivel' => 20, 'ataque' => 60, 'defensa' => 65, 'user_id' => 1],
            ['nombre' => 'Pikachu', 'tipo' => 'Aire', 'tamano' => 'Pequeño', 'nivel' => 8, 'ataque' => 55, 'defensa' => 40, 'user_id' => 1],
            ['nombre' => 'Geodude', 'tipo' => 'Tierra', 'tamano' => 'Pequeño', 'nivel' => 15, 'ataque' => 50, 'defensa' => 75, 'user_id' => 1],
            ['nombre' => 'Pidgey', 'tipo' => 'Aire', 'tamano' => 'Pequeño', 'nivel' => 7, 'ataque' => 45, 'defensa' => 35, 'user_id' => 1],
        ];

        // Los insertamos uno a uno en la base de datos
        foreach ($xuxemons as $xuxe) {
            Xuxemon::create($xuxe);
        }
    }
}