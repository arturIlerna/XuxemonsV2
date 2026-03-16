import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth'; 

// Actualizamos la interfaz para que coincida con tu base de datos
export interface UserData {
  id: number;
  name: string;
  lastname: string; 
  email: string;
  role: string;
  xuxe_id: string; // 👈 Laravel te guarda el ID visual aquí
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  
  users: UserData[] = [];

  constructor(private router: Router, private authService: Auth) {} // Inyectamos authService
  
  ngOnInit() {
    // Le pedimos a Laravel la lista de usuarios
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data; // Guardamos los usuarios
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}