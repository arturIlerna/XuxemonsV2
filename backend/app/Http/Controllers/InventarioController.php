<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Inventario;
use App\Models\Xuxemon;

class InventarioController extends Controller
{
    public function index()
    {
        $inventario = Inventario::with('xuxemon')
            ->where('user_id', auth()->id())
            ->get();
        return response()->json($inventario);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'xuxemon_id' => 'required|exists:xuxemons,id',
            'cantidad' => 'integer|min:1'
        ]);
        
        $existente = Inventario::where('user_id', auth()->id())
            ->where('xuxemon_id', $request->xuxemon_id)
            ->first();
            
        if ($existente) {
            $existente->cantidad += $request->cantidad ?? 1;
            $existente->save();
            return response()->json($existente);
        }
        
        $inventario = Inventario::create([
            'user_id' => auth()->id(),
            'xuxemon_id' => $request->xuxemon_id,
            'cantidad' => $request->cantidad ?? 1
        ]);
        
        return response()->json($inventario, 201);
    }
    
    public function update(Request $request, $id)
    {
        $item = Inventario::where('user_id', auth()->id())->findOrFail($id);
        
        $request->validate(['cantidad' => 'required|integer|min:0']);
        
        if ($request->cantidad == 0) {
            $item->delete();
            return response()->json(['message' => 'Item eliminado']);
        }
        
        $item->update(['cantidad' => $request->cantidad]);
        return response()->json($item);
    }
    
    public function destroy($id)
    {
        $item = Inventario::where('user_id', auth()->id())->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Item eliminado']);
    }
}