import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { Xuxedex } from './components/xuxedex/xuxedex'; 
import { authGuard } from './guards/auth.guard';
import { Mochila } from './components/mochila/mochila';
import { Admin } from './components/admin/admin';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard]
  },
  { 
    path: 'profile',
    component: Profile, 
    canActivate: [authGuard] 
  },
  { 
    path: 'xuxedex',                    
    component: Xuxedex,
    canActivate: [authGuard]           
  },
  { path: 'inventory', component: Mochila },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];