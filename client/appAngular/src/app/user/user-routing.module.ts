import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserAllComponent } from './user-all/user-all.component';
import { authGuard } from '../share/auth.guard';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';

const routes: Routes = [
  {
    path: 'usuario',
    component: UserIndexComponent,
    children: [
      { path: 'registrar', component: UserCreateComponent },
      { path: 'login', component: UserLoginComponent }
    ]
  },
  {
    path: 'usuario/create', component: UserCreateComponent,
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    }
  },
  {
    path: 'usuario/changePassword', component: UserChangePasswordComponent
  },
  {
    path: 'usuario/all', component: UserAllComponent,
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
