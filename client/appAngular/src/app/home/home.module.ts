import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import {MatCardModule} from '@angular/material/card';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';

@NgModule({
  declarations: [
    InicioComponent,
    AcercaDeComponent,
    HomeClienteComponent,
    HomeAdminComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatCardModule
  ]
})
export class HomeModule { }
