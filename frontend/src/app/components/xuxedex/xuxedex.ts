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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css'
})
export class Xuxedex implements OnInit, OnDestroy {
  
  userName: string = '';
  allXuxemons: Xuxemon[] = [];
  filteredXuxemons: Xuxemon[] = [];
  
  searchTerm: string = '';
  selectedType: string = 'todos';
  selectedSize: string = 'todas';
  
  loading: boolean = false;
  error: string = '';

  private authSub!: Subscription;
  private xuxeSub!: Subscription;

  constructor(
    private authService: Auth,
    private xuxemonsService: XuxemonsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authSub = this.authService.currentUser$.subscribe(user => {
      if (user && user.nombre) {
        this.userName = user.nombre;
      } else {
        this.userName = 'Entrenador';
      }
    });

    this.xuxeSub = this.xuxemonsService.getXuxemons().subscribe({
      next: (data: Xuxemon[]) => {
        this.allXuxemons = data;
        this.filterXuxemons();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando Xuxemons:', err)
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.xuxeSub) this.xuxeSub.unsubscribe();
  }

  evolveSize(xuxemon: Xuxemon, event: Event) {
    event.stopPropagation();
    if (xuxemon.tamano === 'Pequeño') {
      xuxemon.tamano = 'Mediano';
      xuxemon.ataque += 20;
      xuxemon.defensa += 15;
      xuxemon.nivel += 5;
    } else if (xuxemon.tamano === 'Mediano') {
      xuxemon.tamano = 'Grande';
      xuxemon.ataque += 20;
      xuxemon.defensa += 15;
      xuxemon.nivel += 5;
    } else {
      alert('¡Ya es tamaño Grande! No puede evolucionar más');
    }
  }

  filterXuxemons() {
    const searchLower = this.searchTerm?.toLowerCase() || '';
    this.filteredXuxemons = (this.allXuxemons || []).filter(xuxemon => {
      const nombre = xuxemon?.nombre?.toLowerCase() || '';
      const tipo = xuxemon?.tipo || '';
      const tamano = xuxemon?.tamano || '';
      
      const matchesSearch = nombre.includes(searchLower);
      const matchesType = this.selectedType === 'todos' || tipo === this.selectedType;
      const matchesSize = this.selectedSize === 'todas' || tamano === this.selectedSize;
      
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

  getSizeText(tamano: string): string {
    return tamano;
  }

  getTypeColor(tipo: string): string {
    const colors: Record<string, string> = {
      'Agua': '#2196F3',
      'Tierra': '#8B4513',
      'Aire': '#E0E0E0'
    };
    return colors[tipo] || '#9E9E9E';
  }

  getTypeGradient(tipo: string): string {
    const gradients: Record<string, string> = {
      'Agua': 'linear-gradient(135deg, #2196F3, #64B5F6)',
      'Tierra': 'linear-gradient(135deg, #8B4513, #A0522D)',
      'Aire': 'linear-gradient(135deg, #E0E0E0, #F5F5F5)'
    };
    return gradients[tipo] || 'linear-gradient(135deg, #9E9E9E, #BDBDBD)';
  }

  viewDetails(xuxemon: Xuxemon) {
    console.log('Ver detalles de:', xuxemon.nombre);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 