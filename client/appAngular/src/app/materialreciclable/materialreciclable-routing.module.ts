import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialreciclableIndexComponent } from './materialreciclable-index/materialreciclable-index.component';
import { MaterialreciclableDetailComponent } from './materialreciclable-detail/materialreciclable-detail.component';
import { MaterialreciclableAllComponent } from './materialreciclable-all/materialreciclable-all.component';
import { MaterialreciclableFormComponent } from './materialreciclable-form/materialreciclable-form.component';

const routes: Routes = [
  {
    path: 'materialreciclable', component: MaterialreciclableIndexComponent
  },
  {
    path: 'materialreciclable/all', component: MaterialreciclableAllComponent
  },
  {
    path: 'materialreciclable/create', component: MaterialreciclableFormComponent
  }
  ,
  {
    path: 'materialreciclable/:id', component: MaterialreciclableDetailComponent
  },
  {
    path: 'materialreciclable/update/:id', component: MaterialreciclableFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MaterialreciclableRoutingModule { }