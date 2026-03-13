import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule], 
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  public user: any = null;
  public profileForm!: FormGroup; // Guardamos el formulario

  constructor(
    private authService: Auth, 
    private router: Router,
    private fb: FormBuilder // Creamos el constructor
  ) {}

  ngOnInit() {
    // Creamos la estructura y las validaciones 
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.minLength(6)]] 
    });

    // Nos suscribimos al BehaviorSubjec
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        
        // patchValue rellena los inputs automáticamente
        this.profileForm.patchValue({
          name: this.user.name,
          lastname: this.user.lastname || '', 
          email: this.user.email
        });
      }
    });
  }

  // Función para guardar los cambios
  onUpdateProfile() {
    if (this.profileForm.invalid) {
      alert('⚠️ Por favor, corrige los errores en rojo antes de guardar.');
      return;
    }

    const updatedData = this.profileForm.value;

    // Enviamos los datos al backend
    this.authService.updateProfile(this.user.id, updatedData).subscribe({
      next: (res) => {
        alert('¡Perfil actualizado con éxito! 🎉');
        
        // Actualizamos nuestra variable local
        this.user = res.user;
        
        // Guardamos los nuevos datos en el localStorage para que el saludo del Dashboard se actualice
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // Vaciamos el campo de la contraseña por seguridad
        this.profileForm.get('password')?.reset('');
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        alert('Hubo un problema al guardar los cambios. Revisa la consola.');
      }
    });
  }

  // Funcion de baja/borrado
  onDeleteAccount() {
    const isConfirmed = confirm('⚠️ ¿Estás seguro de que quieres darte de baja? Perderás tu cuenta.');
    if (isConfirmed && this.user) {
      this.authService.deleteAccount(this.user.id).subscribe({
        next: (res) => {
          alert('Cuenta eliminada correctamente. ¡Una pena verte partir!');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al dar de baja:', err);
          alert('Hubo un problema al eliminar la cuenta. Inténtalo de nuevo más tarde.');
        }
      });
    }
  }
}