import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideojuegoRoutingModule } from './videojuego-routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import {MatDividerModule} from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';  
import { MatMenuModule } from '@angular/material/menu';
import {MatDialogModule} from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { VideojuegoDiagComponent } from './videojuego-diag/videojuego-diag.component';
import { VideojuegoIndexComponent } from './videojuego-index/videojuego-index.component';
import { VideojuegoDetailComponent } from './videojuego-detail/videojuego-detail.component';
import { VideojuegoAllComponent } from './videojuego-all/videojuego-all.component';
import { VideojuegoFormComponent } from './videojuego-form/videojuego-form.component';

@NgModule({
  declarations: [
    VideojuegoDiagComponent,
    VideojuegoIndexComponent,
    VideojuegoDetailComponent,
    VideojuegoAllComponent,
    VideojuegoFormComponent
  ],
  imports: [
    CommonModule,
    VideojuegoRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule, //Gestionar Formularios
  ]
})
export class VideojuegoModule { }
