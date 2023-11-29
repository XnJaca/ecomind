import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentroacopioIndexComponent } from './centroacopio-index/centroacopio-index.component';
import { CentroacopioIndexadminComponent } from './centroacopio-indexadmin/centroacopio-indexadmin.component';
import { CentroacopioFormComponent } from './centroacopio-form/centroacopio-form.component';
import { CentroacopioAllComponent } from './centroacopio-all/centroacopio-all.component';


const routes: Routes = [
  {
    path: 'centroacopio', component: CentroacopioIndexComponent
  },
  {
    path: 'centroacopio/all', component: CentroacopioAllComponent
  },
  {
    path: 'centroacopio/administrador', component: CentroacopioIndexadminComponent
  },
  {
    path: 'centroacopio/create', component: CentroacopioFormComponent
  },
  {
    path: 'centroacopio/update/:id', component: CentroacopioFormComponent
  }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class CentroacopioRoutingModule { }