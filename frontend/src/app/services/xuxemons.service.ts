import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Xuxemon {
  id: number;
  name: string;
  type: 'Agua' | 'Tierra' | 'Aire';
  size: 'Pequeño' | 'Mediano' | 'Grande';
  level: number;
  attack: number;
  defense: number;
  captured: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class XuxemonsService {
  private apiUrl = environment.apiUrl;

  private xuxemonsSubject = new BehaviorSubject<Xuxemon[]>([]);
  public xuxemons$ = this.xuxemonsSubject.asObservable();

  private mockXuxemons: Xuxemon[] = [
    { id: 1, name: 'Floppi', type: 'Tierra', size: 'Pequeño', level: 5, attack: 40, defense: 50, captured: true },
    { id: 2, name: 'Charmander', type: 'Aire', size: 'Mediano', level: 18, attack: 70, defense: 45, captured: true },
    { id: 3, name: 'Squirtle', type: 'Agua', size: 'Pequeño', level: 10, attack: 45, defense: 60, captured: false },
    { id: 4, name: 'Bulbasaur', type: 'Tierra', size: 'Mediano', level: 20, attack: 60, defense: 65, captured: true },
    { id: 5, name: 'Pikachu', type: 'Aire', size: 'Pequeño', level: 8, attack: 55, defense: 40, captured: false },
    { id: 6, name: 'Geodude', type: 'Tierra', size: 'Pequeño', level: 15, attack: 50, defense: 75, captured: true },
    { id: 7, name: 'Pidgey', type: 'Aire', size: 'Pequeño', level: 7, attack: 45, defense: 35, captured: true },
  ];

  constructor(private http: HttpClient) {
    this.xuxemonsSubject.next(this.mockXuxemons);
  }
}