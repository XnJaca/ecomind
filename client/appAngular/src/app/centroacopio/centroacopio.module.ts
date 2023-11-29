import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentroacopioRoutingModule } from './centroacopio-routing.module';
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
import { CentroacopioDiagComponent } from './centroacopio-diag/centroacopio-diag.component';
import { CentroacopioIndexComponent } from './centroacopio-index/centroacopio-index.component';
import { FormsModule } from '@angular/forms';
import { CentroacopioIndexadminComponent } from './centroacopio-indexadmin/centroacopio-indexadmin.component';
import { CentroacopioFormComponent } from './centroacopio-form/centroacopio-form.component';
import { CentroacopioAllComponent } from './centroacopio-all/centroacopio-all.component';

@NgModule({
    declarations: [
        CentroacopioDiagComponent,
        CentroacopioIndexComponent,
        CentroacopioIndexadminComponent,
        CentroacopioFormComponent,
        CentroacopioAllComponent,
    ],
    imports: [
      CommonModule,
      FormsModule,
      CentroacopioRoutingModule,
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
      ReactiveFormsModule
    ]
  })

export class CentroacopioModule { }