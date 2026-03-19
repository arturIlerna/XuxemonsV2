<?php

namespace App\Http\Controllers;

use App\Models\Xuxemon; 
use Illuminate\Http\Request;

class XuxemonController extends Controller
{
    // Función para obtener todos los Xuxemons 
    public function index()
    {
        $xuxemons = Xuxemon::all();
        
        return response()->json($xuxemons, 200);
    }
}
