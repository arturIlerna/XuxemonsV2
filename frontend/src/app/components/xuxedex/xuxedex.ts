import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { XuxemonsService, Xuxemon } from '../../services/xuxemons.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Añadido RouterLink por seguridad para la navbar
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css'
})
export class Xuxedex implements OnInit, OnDestroy {
  
  userName: string = '';
  allXuxemons: Xuxemon[] = []; // Ahora empieza vacío
  filteredXuxemons: Xuxemon[] = [];
  
  searchTerm: string = '';
  selectedType: string = 'todos';
  selectedSize: string = 'todas';
  
  loading: boolean = false;
  error: string = '';

  // Variables para guardar las suscripciones y no saturar la memoria
  private authSub!: Subscription;
  private xuxeSub!: Subscription;

  constructor(
    private authService: Auth,
    private xuxemonsService: XuxemonsService, // Inyectamos el servicio
    private router: Router,
    private cdr: ChangeDetectorRef // Añadimos esto para obligar a Angular a redibujar
  ) {}

  ngOnInit() {
    // 1. Escuchamos al usuario de forma segura (sin que pete si hay F5)
    this.authSub = this.authService.currentUser$.subscribe(user => {
      if (user && user.name) {
        this.userName = user.name;
      } else {
        this.userName = 'Entrenador';
      }
    });

    // 2. Escuchamos a la radio de Xuxemons (Ahora conectado a Laravel)
    this.xuxeSub = this.authService.getAllXuxemons().subscribe({
      next: (data: any) => {
        // Filtro por si los datos vienen envueltos
        if (Array.isArray(data)) {
          this.allXuxemons = data;
        } else if (data && data.data) {
          this.allXuxemons = data.data;
        } else {
          this.allXuxemons = Object.values(data);
        }
        
        this.filterXuxemons(); // Aplicamos los filtros al recibir los datos
        this.cdr.detectChanges(); // Forzamos a que se pinte en pantalla
      },
      error: (err) => console.error('Error cargando Xuxemons:', err)
    });
  }

  ngOnDestroy() {
    // Cuando el usuario sale de la Xuxedex, apagamos las radios para no gastar memoria
    if (this.authSub) this.authSub.unsubscribe();
    if (this.xuxeSub) this.xuxeSub.unsubscribe();
  }

  evolveSize(xuxemon: Xuxemon, event: Event) {
    event.stopPropagation();
    if (xuxemon.size === 'Grande') {
      alert('¡Ya es tamaño Grande! No puede evolucionar más');
      return;
    }

    let neededXuxes = xuxemon.size === 'Pequeño' ? 3 : 5;
    if (xuxemon.enfermedad === 'Bajón de azúcar') neededXuxes += 2;

    if (xuxemon.enfermedad === 'Atracón') {
      alert(`¡${xuxemon.name} no puede comer porque tiene Atracón!`);
      return;
    }

    const confirmEvolution = confirm(`¿Quieres alimentar a ${xuxemon.name}? Necesitas ${neededXuxes} Xuxes para subir de tamaño.`);

    if (confirmEvolution) {
      // Aplicar sistema de infección simulado para el Nivel 3 (en frontend si no está en backend)
      const prob = Math.random() * 100;
      if (prob <= 5) {
        xuxemon.enfermedad = 'Bajón de azúcar';
        alert(`Oh no, ${xuxemon.name} pilló Bajón de azúcar.`);
      } else if (prob > 5 && prob <= 15) {
        // "Sobredosis de sucre" en frontend no tiene efectos extras a "Bajón de azúcar" según documento, pero se podría modelar si se precisa.
        alert(`Oh no, ${xuxemon.name} tuvo una Sobredosis de sucre.`);
      } else if (prob > 15 && prob <= 30) {
        xuxemon.enfermedad = 'Atracón';
        alert(`Oh no, ${xuxemon.name} pilló un Atracón.`);
      }

      if (xuxemon.size === 'Pequeño') {
        xuxemon.size = 'Mediano';
        xuxemon.attack += 20;
        xuxemon.defense += 15;
        xuxemon.level += 5;
        alert(`¡${xuxemon.name} ha evolucionado a tamaño Mediano!`);
      } else if (xuxemon.size === 'Mediano') {
        xuxemon.size = 'Grande';
        xuxemon.attack += 20;
        xuxemon.defense += 15;
        xuxemon.level += 5;
        alert(`¡${xuxemon.name} ha evolucionado a tamaño Grande!`);
      }
    }
  }

  filterXuxemons() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredXuxemons = this.allXuxemons.filter(xuxemon => {
      const matchesSearch = xuxemon.name.toLowerCase().includes(searchLower);
      const matchesType = this.selectedType === 'todos' || xuxemon.type === this.selectedType;
      const matchesSize = this.selectedSize === 'todas' || xuxemon.size === this.selectedSize;
      return matchesSearch && matchesType && matchesSize;
    });
  }

  filterByType(type: string) {
    this.selectedType = type;
    this.filterXuxemons();
  }

  filterBySize(size: string) {
    this.selectedSize = size;
    this.filterXuxemons();
  }

  getSizeText(size: string): string {
    return size;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Agua': '#2196F3',
      'Tierra': '#8B4513',
      'Aire': '#E0E0E0'
    };
    return colors[type] || '#9E9E9E';
  }

  getTypeGradient(type: string): string {
    const gradients: Record<string, string> = {
      'Agua': 'linear-gradient(135deg, #2196F3, #64B5F6)',
      'Tierra': 'linear-gradient(135deg, #8B4513, #A0522D)',
      'Aire': 'linear-gradient(135deg, #E0E0E0, #F5F5F5)'
    };
    return gradients[type] || 'linear-gradient(135deg, #9E9E9E, #BDBDBD)';
  }

  viewDetails(xuxemon: Xuxemon) {
    console.log('Ver detalles de:', xuxemon.name);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}