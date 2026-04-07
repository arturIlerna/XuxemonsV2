import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { FriendsService } from '../../services/friends.service';
import { BattleService } from '../../services/battle.service';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './friends.html',
  styleUrls: ['./friends.css']
})
export class Friends implements OnInit {
  searchControl = new FormControl('');
  searchResults: any[] = [];
  friendsList: any[] = [];
  pendingRequests: any[] = [];
  userName: string = 'Usuario'; // Obtener del estado real

  constructor(
    private friendsService: FriendsService,
    private battleService: BattleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(term => term !== null && term.length >= 3)
      )
      .subscribe(term => {
        if (term) {
          this.searchUsers(term);
        }
      });

    this.loadFriends();
    this.loadPendingRequests();
  }

  searchUsers(term: string) {
    this.friendsService.searchUsers(term).subscribe((results: any) => {
      this.searchResults = results;
    });
  }

  sendRequest(userId: number) {
    this.friendsService.sendRequest(userId).subscribe(() => {
      alert('Solicitud enviada');
      this.searchResults = this.searchResults.filter(user => user.id !== userId);
    });
  }

  loadFriends() {
    this.friendsService.getFriends().subscribe((friends: any) => {
      this.friendsList = friends;
    });
  }

  loadPendingRequests() {
    this.friendsService.getPendingRequests().subscribe((requests: any) => {
      this.pendingRequests = requests;
    });
  }

  acceptRequest(requestId: number) {
    this.friendsService.acceptRequest(requestId).subscribe(() => {
      this.loadFriends();
      this.loadPendingRequests();
    });
  }

  rejectRequest(requestId: number) {
    this.friendsService.rejectRequest(requestId).subscribe(() => {
      this.loadPendingRequests();
    });
  }

  removeFriend(friendId: number) {
    if(confirm('¿Seguro que quieres eliminar este amigo?')) {
      this.friendsService.removeFriend(friendId).subscribe(() => {
        this.loadFriends();
      });
    }
  }

  requestBattle(friendId: number) {
    this.battleService.requestBattle(friendId).subscribe((battle: any) => {
      this.router.navigate(['/battle', battle.id]);
    });
  }
}
