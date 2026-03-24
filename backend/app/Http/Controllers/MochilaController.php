<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\InventarioItem;
use App\Models\Item;

class MochilaController extends Controller
{
    public function index()
    {
        $items = InventarioItem::with('item')
            ->where('user_id', auth()->id())
            ->get();
        
        $slots = [];
        foreach ($items as $invItem) {
            $maxStack = $invItem->item->max_stack;
            $cantidad = $invItem->cantidad;
            
            $espacios = ceil($cantidad / $maxStack);
            
            for ($i = 0; $i < $espacios && count($slots) < 20; $i++) {
                $cantidadEnSlot = min($maxStack, $cantidad - ($i * $maxStack));
                $slots[] = [
                    'item' => $invItem->item,
                    'cantidad' => $cantidadEnSlot,
                    'id_inventario' => $invItem->id
                ];
            }
        }
        
        while (count($slots) < 20) {
            $slots[] = ['item' => null, 'cantidad' => 0, 'id_inventario' => null];
        }
        
        return response()->json($slots);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'cantidad' => 'required|integer|min:1'
        ]);
        
        $inventarioActual = InventarioItem::where('user_id', auth()->id())
            ->where('item_id', $request->item_id)
            ->first();
        
        if ($inventarioActual) {
            $inventarioActual->increment('cantidad', $request->cantidad);
        } else {
            InventarioItem::create([
                'user_id' => auth()->id(),
                'item_id' => $request->item_id,
                'cantidad' => $request->cantidad
            ]);
        }
        
        return response()->json(['message' => 'Xuxes añadidos correctamente']);
    }
    
    public function destroy($id)
    {
        $item = InventarioItem::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();
        
        if ($item->cantidad > 1) {
            $item->decrement('cantidad');
        } else {
            $item->delete();
        }
        
        return response()->json(['message' => 'Xuxe usado correctamente']);
    }
}