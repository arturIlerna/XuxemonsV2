import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Xuxemon {
  id: number;
  nombre: string;
  tipo: 'Agua' | 'Tierra' | 'Aire';
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  nivel: number;
  ataque: number;
  defensa: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class XuxemonsService {
  private apiUrl = environment.apiUrl;

  private xuxemonsSubject = new BehaviorSubject<Xuxemon[]>([]);
  public xuxemons$ = this.xuxemonsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarXuxemons();
  }

  cargarXuxemons() {
    this.http.get<Xuxemon[]>(`${this.apiUrl}/xuxemons`).subscribe({
      next: (data) => {
        this.xuxemonsSubject.next(data);
      },
      error: (err) => {
        console.error('Error cargando xuxemons:', err);
        this.xuxemonsSubject.next([]);
      }
    });
  }

  getXuxemons(): Observable<Xuxemon[]> {
    return this.xuxemons$;
  }

  actualizarXuxemon(xuxemon: Xuxemon): Observable<Xuxemon> {
    return this.http.put<Xuxemon>(`${this.apiUrl}/xuxemons/${xuxemon.id}`, {
      nombre: xuxemon.nombre,
      tipo: xuxemon.tipo,
      tamano: xuxemon.tamano,
      nivel: xuxemon.nivel,
      ataque: xuxemon.ataque,
      defensa: xuxemon.defensa
    });
  }
}