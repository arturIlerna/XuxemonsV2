<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\XuxemonController;
use App\Http\Controllers\InventarioController;

// RUTAS PÚBLICAS (No necesitan Token) ---
Route::post('/register', [AuthController::class, 'register']);

// Login para obtener el Token JWT
Route::post('/login', [AuthController::class, 'login']);


// RUTAS PROTEGIDAS (Necesitan JWT) ---
// Estas rutas solo funcionarán con el Provider activo
Route::middleware(['auth:api'])->group(function () {
    
    // Cerrar sesión y refrescar token
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // Obtener mis datos de usuario logueado
    Route::get('/me', [AuthController::class, 'me']);

  
    // Dashboard de bienvenida
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Bienvenido al dashboard de Xuxedex',
            'user' => auth()->user()
        ]);
    });

    // Obtener todos los usuarios (Para panel de admin)
    Route::get('/users', [AuthController::class, 'index']);

    // Obtener catálogo global de Xuxemons
    Route::get('/xuxemons', [XuxemonController::class, 'index']);

});

// Ruta de comprobación rápida
Route::get('/health', function () {
    return response()->json(['status' => 'OK', 'message' => 'API de Xuxedex funcionando']);
});

// Ruta para darse de baja
Route::delete('/users/{id}', [AuthController::class, 'destroy']);

// Ruta para actualizar el perfil del usuario
Route::put('/users/{id}', [AuthController::class, 'update']);


// RUTAS DE INVENTARIO
Route::middleware(['auth:api'])->group(function () {
    Route::get('/inventario', [InventarioController::class, 'index']);
    Route::post('/inventario', [InventarioController::class, 'store']);
    Route::put('/inventario/{id}', [InventarioController::class, 'update']);
    Route::delete('/inventario/{id}', [InventarioController::class, 'destroy']);
});


// RUTAS DE MOCHILA (XUXES)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/mochila', [App\Http\Controllers\MochilaController::class, 'index']);
    Route::post('/mochila', [App\Http\Controllers\MochilaController::class, 'store']);
    Route::delete('/mochila/{id}', [App\Http\Controllers\MochilaController::class, 'destroy']);
});
