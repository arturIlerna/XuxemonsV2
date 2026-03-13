import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

interface Xuxemon {
  id: number;
  name: string;
  type: 'Agua' | 'Tierra' | 'Aire';
  size: 'Pequeño' | 'Mediano' | 'Grande';
  level: number;
  attack: number;
  defense: number;
  captured: boolean;
}

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css'
})
export class Xuxedex implements OnInit {
  
  userName: string = '';
  
  // Datos quemados para prueba (sin backend)
  allXuxemons: Xuxemon[] = [
    { id: 1, name: 'Floppi', type: 'Tierra', size: 'Pequeño', level: 5, attack: 40, defense: 50, captured: true },
    { id: 2, name: 'Charmander', type: 'Aire', size: 'Mediano', level: 18, attack: 70, defense: 45, captured: true },
    { id: 3, name: 'Squirtle', type: 'Agua', size: 'Pequeño', level: 10, attack: 45, defense: 60, captured: false },
    { id: 4, name: 'Bulbasaur', type: 'Tierra', size: 'Mediano', level: 20, attack: 60, defense: 65, captured: true },
    { id: 5, name: 'Pikachu', type: 'Aire', size: 'Pequeño', level: 8, attack: 55, defense: 40, captured: false },
    { id: 6, name: 'Geodude', type: 'Tierra', size: 'Pequeño', level: 15, attack: 50, defense: 75, captured: true },
    { id: 7, name: 'Charmander', type: 'Aire', size: 'Pequeño', level: 7, attack: 45, defense: 35, captured: true },
  ];

  filteredXuxemons: Xuxemon[] = [];
  
  searchTerm: string = '';
  selectedType: string = 'todos';
  selectedSize: string = 'todas';
  
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {
    const user = this.authService.getUser();
    this.userName = user?.name || 'Entrenador';
  }

  ngOnInit() {
    this.filteredXuxemons = [...this.allXuxemons];
  }

  evolveSize(xuxemon: Xuxemon, event: Event) {
    event.stopPropagation();
    
    if (xuxemon.size === 'Pequeño') {
      xuxemon.size = 'Mediano';
      xuxemon.attack += 20;
      xuxemon.defense += 15;
      xuxemon.level += 5;
    } else if (xuxemon.size === 'Mediano') {
      xuxemon.size = 'Grande';
      xuxemon.attack += 20;
      xuxemon.defense += 15;
      xuxemon.level += 5;
    } else {
      alert('¡Ya es tamaño Grande! No puede evolucionar más');
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