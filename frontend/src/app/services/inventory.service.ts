import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definimos cómo es un objeto del juego
export interface Item {
  id: number;
  name: string;
  type: 'xuxe' | 'vacuna'; // Diferenciamos apilables de no apilables
  icon: string; // Un emoji o ruta de imagen para que quede chulo
}

// Definimos cómo es un hueco de la mochila
export interface Slot {
  id: number; // Del 0 al 19 (los 20 huecos)
  item: Item | null; // Puede tener un objeto o estar vacío (null)
  quantity: number; // Cantidad apilada
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // 1. Creamos la mochila vacía con exactamente 20 huecos (Grid 4x5)
  private initialSlots: Slot[] = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    item: null,
    quantity: 0
  }));

  // 2. Nuestra "Emisora de Radio" para la mochila
  private inventorySubject = new BehaviorSubject<Slot[]>(this.initialSlots);
  public inventory$ = this.inventorySubject.asObservable();

  constructor() {
    // Metemos unos datos de prueba 
    // las reglas de la rúbrica (apilables x5, vacunas x1)
    this.cargarDatosDePrueba();
  }

  private cargarDatosDePrueba() {
    // Hacemos una copia de la mochila vacía
    const slots = [...this.initialSlots];
    
    // Hueco 0: Chuches (Apilables, le ponemos 3)
    slots[0] = { 
      id: 0, 
      item: { id: 1, name: 'Xuxe de Fuerza', type: 'xuxe', icon: '🍬' }, 
      quantity: 3 
    };
    
    // Hueco 1: Chuches al máximo (Apilables, tope 5)
    slots[1] = { 
      id: 1, 
      item: { id: 2, name: 'Xuxe de Vida', type: 'xuxe', icon: '🍭' }, 
      quantity: 5 
    };

    // Hueco 2: Vacuna (NO apilable, máximo 1)
    slots[2] = { 
      id: 2, 
      item: { id: 3, name: 'Vacuna Curativa', type: 'vacuna', icon: '💉' }, 
      quantity: 1 
    };

    // Emitimos la mochila con estos 3 objetos y 17 huecos vacíos
    this.inventorySubject.next(slots);
  }
}