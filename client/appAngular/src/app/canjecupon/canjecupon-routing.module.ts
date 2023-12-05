import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanjecuponIndexComponent } from './canjecupon-index/canjecupon-index.component';
import { CanjeCuponCreateComponent } from './canje-cupon-create/canje-cupon-create.component';
import { authGuard } from '../share/auth.guard';
import { CanjeCuponViewComponent } from './canje-cupon-view/canje-cupon-view.component';
import { CanjecuponListComponent } from './canjecupon-list/canjecupon-list.component';

const routes: Routes = [
  {
    path: 'canjecupon',
    component: CanjecuponIndexComponent,
    canActivate:[authGuard],
    data:{
      roles:['Administrador']
    }
  },
  {
    path: 'canjecupon/create',
    component: CanjeCuponCreateComponent,
    canActivate:[authGuard],
    data:{
      roles:['Administrador']
    }
  },
  {
    path: 'canjecupon/update/:id',
    component: CanjeCuponCreateComponent,
    canActivate:[authGuard],
    data:{
      roles:['Administrador']
    }
  },
  {
    path: 'canjecupon/view',
    component: CanjeCuponViewComponent,
    canActivate:[authGuard],
    data:{
      roles:['Administrador','Cliente']
    }
  },
  {
    path: 'canjecupon/historial/:id',
    component: CanjecuponListComponent,
    canActivate:[authGuard],
    data:{
      roles:['Administrador','Cliente']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanjecuponRoutingModule { }
