import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialreciclableRoutingModule } from './materialreciclable-routing.module';
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
import { FormsModule } from '@angular/forms';
import { MaterialreciclableDiagComponent } from './materialreciclable-diag/materialreciclable-diag.component';
import { MaterialreciclableIndexComponent } from './materialreciclable-index/materialreciclable-index.component';
import { MaterialreciclableDetailComponent } from './materialreciclable-detail/materialreciclable-detail.component';
import { MaterialreciclableAllComponent } from './materialreciclable-all/materialreciclable-all.component';
import { MaterialreciclableFormComponent } from './materialreciclable-form/materialreciclable-form.component';

@NgModule({
    declarations: [
        MaterialreciclableDiagComponent,
        MaterialreciclableIndexComponent,
        MaterialreciclableDetailComponent,
        MaterialreciclableAllComponent,
        MaterialreciclableFormComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      MaterialreciclableRoutingModule,
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

export class MaterialreciclableModule { }