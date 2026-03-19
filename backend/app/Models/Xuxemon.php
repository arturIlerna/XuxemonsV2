<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Xuxemon extends Model
{
    use HasFactory;

    // Los campos que permitimos rellenar desde la API
    protected $fillable = [
        'name',
        'type',
        'size',
        'level',
        'attack',
        'defense',
        'image'
    ];
}
