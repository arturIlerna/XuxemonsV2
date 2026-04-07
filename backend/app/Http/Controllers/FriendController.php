<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    // Buscar usuarios (mínimo 3 caracteres, buscar por ID visual o nombre)
    public function search(Request $request)
    {
        $term = $request->query('term');
        if (!$term || strlen($term) < 3) {
            return response()->json([]);
        }

        $userId = Auth::id();

        $users = User::where('id', '!=', $userId)
                     ->where(function($query) use ($term) {
                         $query->where('id_visual', 'LIKE', "%{$term}%")
                               ->orWhere('name', 'LIKE', "%{$term}%");
                     })
                     ->get(['id', 'name', 'id_visual']);

        return response()->json($users);
    }

    // Enviar solicitud de amistad
    public function sendRequest(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $userId = Auth::id();
        $friendId = $request->user_id;

        if ($userId == $friendId) {
            return response()->json(['error' => 'No puedes enviarte una solicitud a ti mismo'], 400);
        }

        // Comprobar si ya existe una relación (de ida o de vuelta)
        $existing = Friend::where(function($query) use ($userId, $friendId) {
            $query->where('user_id', $userId)->where('friend_id', $friendId);
        })->orWhere(function($query) use ($userId, $friendId) {
            $query->where('user_id', $friendId)->where('friend_id', $userId);
        })->first();

        if ($existing) {
            return response()->json(['error' => 'Ya existe una solicitud o relación de amistad'], 400);
        }

        $friend = Friend::create([
            'user_id' => $userId,
            'friend_id' => $friendId,
            'status' => 'pending'
        ]);

        return response()->json($friend, 201);
    }

    // Obtener solicitudes pendientes (donde friend_id = mi_id)
    public function pendingRequests()
    {
        $userId = Auth::id();
        $requests = Friend::where('friend_id', $userId)
                          ->where('status', 'pending')
                          ->with('user:id,name,id_visual')
                          ->get()
                          ->map(function($request) {
                              return [
                                  'id' => $request->id,
                                  'sender' => $request->user
                              ];
                          });
        return response()->json($requests);
    }

    // Aceptar solicitud
    public function acceptRequest($id)
    {
        $userId = Auth::id();
        $request = Friend::where('id', $id)->where('friend_id', $userId)->firstOrFail();
        $request->status = 'accepted';
        $request->save();

        return response()->json(['message' => 'Solicitud aceptada']);
    }

    // Rechazar solicitud
    public function rejectRequest($id)
    {
        $userId = Auth::id();
        $request = Friend::where('id', $id)->where('friend_id', $userId)->firstOrFail();
        $request->delete();

        return response()->json(['message' => 'Solicitud rechazada']);
    }

    // Obtener lista de amigos (status = accepted, de ida o de vuelta)
    public function getFriends()
    {
        $userId = Auth::id();

        $friendsAsUser = Friend::where('user_id', $userId)->where('status', 'accepted')->with('friend:id,name,id_visual')->get()->pluck('friend');
        $friendsAsFriend = Friend::where('friend_id', $userId)->where('status', 'accepted')->with('user:id,name,id_visual')->get()->pluck('user');

        $allFriends = $friendsAsUser->merge($friendsAsFriend);

        return response()->json($allFriends);
    }

    // Eliminar amigo
    public function removeFriend($friendId)
    {
        $userId = Auth::id();

        Friend::where(function($query) use ($userId, $friendId) {
            $query->where('user_id', $userId)->where('friend_id', $friendId);
        })->orWhere(function($query) use ($userId, $friendId) {
            $query->where('user_id', $friendId)->where('friend_id', $userId);
        })->delete();

        return response()->json(['message' => 'Amigo eliminado']);
    }
}
