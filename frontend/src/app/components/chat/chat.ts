import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  friendId!: number;
  messages: any[] = [];
  newMessage: string = '';
  myId: number = 0; // Se obtiene del AuthService o decodificando el token
  userName: string = 'Usuario'; // Usuario logueado

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    // En una app real, recuperar de AuthService. Aquí simulamos o recuperamos del payload de JWT.
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.myId = payload.sub; // asumiendo sub en jwt
    }

    this.route.paramMap.subscribe(params => {
      this.friendId = Number(params.get('friendId'));
      this.loadMessages();

      // Auto refresh para simular web sockets
      setInterval(() => {
        this.loadMessages();
      }, 5000);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  loadMessages() {
    if(!this.friendId) return;
    this.chatService.getMessages(this.friendId).subscribe((messages: any) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.friendId, this.newMessage).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }
}
