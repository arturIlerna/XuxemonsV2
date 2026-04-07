import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMessages(friendId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/${friendId}`);
  }

  sendMessage(friendId: number, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/${friendId}`, { message });
  }
}
