import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  searchUsers(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/search?term=${term}`);
  }

  sendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/request`, { user_id: userId });
  }

  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends/requests/pending`);
  }

  acceptRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/requests/${requestId}/accept`, {});
  }

  rejectRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/requests/${requestId}/reject`, {});
  }

  getFriends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends`);
  }

  removeFriend(friendId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/friends/${friendId}`);
  }
}
