import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Recuperamos los datos del usuario actual
  const user = authService.getUser();

  // Comprobamos si el usuario existe y si su rol es "admin"
  // Añado un correo de prueba para poder entrar por si acaso
  if (user && (user.role === 'admin' || user.email === 'admin@xuxemons.com')) {
    return true; // ¡Adelante, puedes pasar!
  }

  // Si no es admin, lo mandamos a su panel normal con un aviso
  alert('🛑 ¡Acceso denegado! Esta zona es solo para Administradores.');
  router.navigate(['/dashboard']);
  return false; // Lo devolvemos
};