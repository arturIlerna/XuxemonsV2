<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Xuxemon; 

class XuxemonSeeder extends Seeder
{
    public function run(): void
    {
        // Nuestro catálogo oficial de Xuxemons
        $xuxemons = [
            ['name' => 'Floppi', 'type' => 'Tierra', 'size' => 'Pequeño', 'level' => 5, 'attack' => 40, 'defense' => 50],
            ['name' => 'Charmander', 'type' => 'Aire', 'size' => 'Mediano', 'level' => 18, 'attack' => 70, 'defense' => 45],
            ['name' => 'Squirtle', 'type' => 'Agua', 'size' => 'Pequeño', 'level' => 10, 'attack' => 45, 'defense' => 60],
            ['name' => 'Bulbasaur', 'type' => 'Tierra', 'size' => 'Mediano', 'level' => 20, 'attack' => 60, 'defense' => 65],
            ['name' => 'Pikachu', 'type' => 'Aire', 'size' => 'Pequeño', 'level' => 8, 'attack' => 55, 'defense' => 40],
            ['name' => 'Geodude', 'type' => 'Tierra', 'size' => 'Pequeño', 'level' => 15, 'attack' => 50, 'defense' => 75],
            ['name' => 'Pidgey', 'type' => 'Aire', 'size' => 'Pequeño', 'level' => 7, 'attack' => 45, 'defense' => 35],
        ];

        // Los insertamos uno a uno en la base de datos
        foreach ($xuxemons as $xuxe) {
            Xuxemon::create($xuxe);
        }
    }
}