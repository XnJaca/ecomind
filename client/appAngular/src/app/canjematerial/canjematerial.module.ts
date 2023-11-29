import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CanjematerialAlladminComponent } from './canjematerial-alladmin/canjematerial-alladmin.component';
import { CanjematerialAllclienteComponent } from './canjematerial-allcliente/canjematerial-allcliente.component';
import { CanjeMaterialRoutingModule } from './canjematerial-routing.module';
import { CanjematerialDetailComponent } from './canjematerial-detail/canjematerial-detail.component';
import { CanjematerialIndexComponent } from './canjematerial-index/canjematerial-index.component';

@NgModule({
  declarations: [
    CanjematerialIndexComponent,
    CanjematerialAllclienteComponent,
    CanjematerialAlladminComponent,
    CanjematerialDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CanjeMaterialRoutingModule,
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
    ReactiveFormsModule,
  ]
})

export class CanjeMaterialModule { }