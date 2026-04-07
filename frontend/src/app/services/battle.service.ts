import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  private apiUrl = 'http://localhost:8000/api';

  public battleResult$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  requestBattle(friendId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/battle/request`, { friend_id: friendId });
  }

  // Enviar jugada de batalla (xuxemon seleccionado y id de batalla)
  fight(battleId: number, myXuxemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/battle/${battleId}/fight`, { xuxemon_id: myXuxemonId });
  }
}
