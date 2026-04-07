<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // Obtener historial de mensajes con un amigo
    public function getMessages($friendId)
    {
        $userId = Auth::id();

        // Controlar que el amigo existe y es realmente amigo (status = accepted)
        // Se puede añadir aquí una validación extra consultando Friend

        $messages = Message::where(function($query) use ($userId, $friendId) {
            $query->where('sender_id', $userId)->where('receiver_id', $friendId);
        })->orWhere(function($query) use ($userId, $friendId) {
            $query->where('sender_id', $friendId)->where('receiver_id', $userId);
        })
        ->orderBy('created_at', 'asc')
        ->with(['sender:id,name', 'receiver:id,name'])
        ->get();

        return response()->json($messages);
    }

    // Enviar mensaje a un amigo
    public function sendMessage(Request $request, $friendId)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userId = Auth::id();

        $message = Message::create([
            'sender_id' => $userId,
            'receiver_id' => $friendId,
            'message' => $request->message
        ]);

        // Cargar las relaciones para devolver
        $message->load(['sender:id,name']);

        return response()->json($message, 201);
    }
}
