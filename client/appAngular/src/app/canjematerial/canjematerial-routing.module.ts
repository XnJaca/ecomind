import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanjematerialAlladminComponent } from './canjematerial-alladmin/canjematerial-alladmin.component';
import { CanjematerialAllclienteComponent } from './canjematerial-allcliente/canjematerial-allcliente.component';
import { CanjematerialDetailComponent } from './canjematerial-detail/canjematerial-detail.component';
import { CanjematerialIndexComponent } from './canjematerial-index/canjematerial-index.component';


const routes: Routes = [
  {
    path: 'canjematerial/cliente', component: CanjematerialAllclienteComponent
  },
  {
    path: 'canjematerial/:id', component: CanjematerialDetailComponent
  },
  {
    path: 'canjematerial/centroacopio/:id', component: CanjematerialAlladminComponent
  },
  {
    path: 'canjematerial', component: CanjematerialIndexComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CanjeMaterialRoutingModule { }
