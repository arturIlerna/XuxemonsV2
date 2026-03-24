import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Item {
  id: number;
  name: string;
  type: 'xuxe' | 'vacuna';
  icon: string;
}

export interface Slot {
  id: number;
  item: Item | null;
  quantity: number;
}

export interface InventarioBackend {
  id: number;
  user_id: number;
  xuxemon_id: number;
  cantidad: number;
  xuxemon?: {
    id: number;
    nombre: string;
    tipo: string;
    tamano: string;
    nivel: number;
    ataque: number;
    defensa: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = environment.apiUrl;
  
  private initialSlots: Slot[] = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    item: null,
    quantity: 0
  }));

  private inventorySubject = new BehaviorSubject<Slot[]>(this.initialSlots);
  public inventory$ = this.inventorySubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarInventarioDesdeBackend();
  }

  // Cargar inventario real desde el backend
  cargarInventarioDesdeBackend() {
    this.http.get<InventarioBackend[]>(`${this.apiUrl}/inventario`).subscribe({
      next: (data) => {
        console.log('Inventario cargado:', data);
        this.convertirBackendAMochila(data);
      },
      error: (err) => {
        console.error('Error cargando inventario:', err);
        // Si falla, cargar datos de prueba
        this.cargarDatosDePrueba();
      }
    });
  }

  // Convertir datos del backend al formato de la mochila
  private convertirBackendAMochila(inventario: InventarioBackend[]) {
    const slots = [...this.initialSlots];
    let slotIndex = 0;
    
    for (const item of inventario) {
      if (slotIndex >= 20) break;
      
      const itemConvertido: Item = {
        id: item.xuxemon_id,
        name: item.xuxemon?.nombre || 'Xuxemon',
        type: 'xuxe',
        icon: this.getIconByType(item.xuxemon?.tipo || '')
      };
      
      slots[slotIndex] = {
        id: slotIndex,
        item: itemConvertido,
        quantity: item.cantidad
      };
      slotIndex++;
    }
    
    this.inventorySubject.next(slots);
  }

  private getIconByType(tipo: string): string {
    const icons: Record<string, string> = {
      'Agua': '💧',
      'Tierra': '🌍',
      'Aire': '💨',
      'Fuego': '🔥',
      'Planta': '🌿',
      'Eléctrico': '⚡'
    };
    return icons[tipo] || '✨';
  }

  private cargarDatosDePrueba() {
    const slots = [...this.initialSlots];
    
    slots[0] = { 
      id: 0, 
      item: { id: 1, name: 'Xuxe de Fuerza', type: 'xuxe', icon: '🍬' }, 
      quantity: 3 
    };
    
    slots[1] = { 
      id: 1, 
      item: { id: 2, name: 'Xuxe de Vida', type: 'xuxe', icon: '🍭' }, 
      quantity: 5 
    };

    slots[2] = { 
      id: 2, 
      item: { id: 3, name: 'Vacuna Curativa', type: 'vacuna', icon: '💉' }, 
      quantity: 1 
    };

    this.inventorySubject.next(slots);
  }

  // Refrescar inventario manualmente
  refrescarInventario() {
    this.cargarInventarioDesdeBackend();
  }
}