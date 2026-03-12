import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { XuxedexService, Xuxemon, User } from '../../services/xuxedex.service';


@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css'
})
export class Xuxedex implements OnInit {

 userName: string = '';
  userId: number = 0;
  isAdmin: boolean = false;
  
  allXuxemons: Xuxemon[] = [];
  filteredXuxemons: Xuxemon[] = [];
  users: User[] = [];
  selectedUserId: number = 0;

  searchTerm: string = '';
  selectedType: string = 'todos';
  selectedSize: string = 'todas';
  

  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private xuxedexService: XuxedexService
  ) {}
   ngOnInit() {
    const user = this.authService.getUser();
    this.userName = user?.name || 'Entrenador';
    this.userId = user?.id || 0;
    this.isAdmin = user?.role === 'admin';
    
    this.loadXuxemons();
    
    if (this.isAdmin) {
      this.loadUsers();
    }
  }
    loadXuxemons() {
    this.loading = true;
    this.error = '';
    
    this.xuxedexService.getMyXuxemons().subscribe({
      next: (data) => {
        this.allXuxemons = data;
        this.filteredXuxemons = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando Xuxemons:', err);
        this.error = 'No se pudieron cargar los Xuxemons';
        this.loading = false;
      }
    });
  }
  }

