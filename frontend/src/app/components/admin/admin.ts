import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // cdr para mostrar definitivamente los puñeteros usuarios :)
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
  xuxe_id: string; 
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

  // Añadimos el cdr (porque no mostraba la puñetera lista de usuarios y con esto actualizamos de nuevo) al constructor y el auth
  constructor(
    private router: Router, 
    private authService: Auth,
    private cdr: ChangeDetectorRef 
  ) {}
  
  ngOnInit() {
    this.authService.getAllUsers().subscribe({
      next: (data: any) => {
        // Tu filtro actual...
        if (Array.isArray(data)) {
          this.users = data;
        } else if (data && data.data) {
          this.users = data.data;
        } else if (data && data.users) {
          this.users = data.users;
        } else {
          this.users = Object.values(data); 
        }

        console.log('✅ ARRAY FINAL PARA EL HTML:', this.users);

        // Obligamos a Angular a pintar la santa tabla de usuarios
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}