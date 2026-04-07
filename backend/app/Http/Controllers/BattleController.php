<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Battle;
use App\Models\UserXuxemon;
use Illuminate\Support\Facades\Auth;

class BattleController extends Controller
{
    // Solicitar batalla
    public function requestBattle(Request $request)
    {
        $request->validate(['friend_id' => 'required|exists:users,id']);

        $battle = Battle::create([
            'user_id' => Auth::id(),
            'friend_id' => $request->friend_id,
            'status' => 'pending'
        ]);

        return response()->json($battle, 201);
    }

    // Calcular resultado de la batalla y transferir xuxemon
    public function fight(Request $request, $battleId)
    {
        $request->validate(['xuxemon_id' => 'required|exists:user_xuxemons,id']);

        $userId = Auth::id();
        $battle = Battle::findOrFail($battleId);

        // Simulamos la elección del amigo por ahora si no está implementada la espera
        // Elegimos un xuxemon al azar del amigo
        $friendXuxemon = UserXuxemon::where('user_id', $battle->friend_id)->whereNull('enfermedad')->inRandomOrder()->first();
        $myUserXuxemon = UserXuxemon::where('id', $request->xuxemon_id)->where('user_id', $userId)->firstOrFail();

        if(!$friendXuxemon) {
            return response()->json(['error' => 'Tu amigo no tiene xuxemons sanos para luchar.'], 400);
        }

        // Lógica de batalla 1D6 + mods
        $myRoll = rand(1, 6);
        $friendRoll = rand(1, 6);

        $myMods = $this->calculateMods($myUserXuxemon->xuxemon, $friendXuxemon->xuxemon);
        $friendMods = $this->calculateMods($friendXuxemon->xuxemon, $myUserXuxemon->xuxemon);

        $myTotal = $myRoll + $myMods;
        $friendTotal = $friendRoll + $friendMods;

        $winner = 'tie';
        $stolenXuxemon = null;
        $lostXuxemon = null;

        if ($myTotal > $friendTotal) {
            $winner = 'you';
            $battle->winner_id = $userId;
            $stolenXuxemon = clone $friendXuxemon;
            $friendXuxemon->user_id = $userId;
            $friendXuxemon->save();
        } else if ($friendTotal > $myTotal) {
            $winner = 'friend';
            $battle->winner_id = $battle->friend_id;
            $lostXuxemon = clone $myUserXuxemon;
            $myUserXuxemon->user_id = $battle->friend_id;
            $myUserXuxemon->save();
        }

        $battle->status = 'finished';
        $battle->save();

        return response()->json([
            'winner' => $winner,
            'your_roll' => $myRoll,
            'your_mods' => $myMods,
            'your_total' => $myTotal,
            'friend_roll' => $friendRoll,
            'friend_mods' => $friendMods,
            'friend_total' => $friendTotal,
            'stolen_xuxemon' => $stolenXuxemon ? $stolenXuxemon->xuxemon : null,
            'lost_xuxemon' => $lostXuxemon ? $lostXuxemon->xuxemon : null
        ]);
    }

    private function calculateMods($my, $theirs)
    {
        $mods = 0;

        // Ventajas de tipo: Agua > Tierra > Aire > Agua
        if ($my->type === 'Agua' && $theirs->type === 'Tierra') $mods += 1;
        if ($my->type === 'Tierra' && $theirs->type === 'Aire') $mods += 1;
        if ($my->type === 'Aire' && $theirs->type === 'Agua') $mods += 1;

        // Desventajas de tipo
        if ($my->type === 'Tierra' && $theirs->type === 'Agua') $mods -= 1;
        if ($my->type === 'Aire' && $theirs->type === 'Tierra') $mods -= 1;
        if ($my->type === 'Agua' && $theirs->type === 'Aire') $mods -= 1;

        // Mods de tamaño
        if ($my->size === 'Mediano') $mods += 1;
        if ($my->size === 'Grande') $mods += 2;

        return $mods;
    }
}
