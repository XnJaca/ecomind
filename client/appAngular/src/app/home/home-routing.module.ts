import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { authGuard } from '../share/auth.guard';




const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'inicio/acerca-de', component: AcercaDeComponent },
  {
    path: 'inicio/cliente', component: HomeClienteComponent,
    canActivate: [authGuard],
    data: {
      roles: ['Cliente']
    }
  },
  {
    path: 'inicio/admin', component: HomeAdminComponent,
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    }
  },
  // { path: '', redirectTo:'/inicio', pathMatch: 'full' },
  // { path: '**', component: InicioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {
}
