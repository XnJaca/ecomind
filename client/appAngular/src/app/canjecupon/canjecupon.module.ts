import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanjecuponRoutingModule } from './canjecupon-routing.module';
import { CanjecuponIndexComponent } from './canjecupon-index/canjecupon-index.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider'; 
import { MatTableModule } from '@angular/material/table';
import {MatDialogModule} from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import {MatCardModule} from '@angular/material/card';
import { CanjeCuponCreateComponent } from './canje-cupon-create/canje-cupon-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CanjeCuponViewComponent } from './canje-cupon-view/canje-cupon-view.component';
import { CanjecuponListComponent } from './canjecupon-list/canjecupon-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    CanjecuponIndexComponent,
    CanjeCuponCreateComponent,
    CanjeCuponViewComponent,
    CanjecuponListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    CanjecuponRoutingModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,MatIconModule,
    MatTableModule,
    LayoutModule,
    MatGridListModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatPaginatorModule

  ]
})
export class CanjecuponModule { }
