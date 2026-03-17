import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InventoryService, Slot } from '../../services/inventory.service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-mochila',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mochila.html',
  styleUrl: './mochila.css'
})
export class Mochila implements OnInit, OnDestroy {
  slots: Slot[] = [];
  userName: string = 'Entrenador';
  
  private invSub!: Subscription;
  private authSub!: Subscription;

  constructor(
    private inventoryService: InventoryService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    // Escuchamos los datos de la mochila
    this.invSub = this.inventoryService.inventory$.subscribe(data => {
      this.slots = data;
    });

    // Escuchamos quién es el usuario para la barra de navegación superior
    this.authSub = this.authService.currentUser$.subscribe(user => {
      if (user && user.name) {
        this.userName = user.name;
      }
    });
  }

  ngOnDestroy() {
    if (this.invSub) this.invSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}