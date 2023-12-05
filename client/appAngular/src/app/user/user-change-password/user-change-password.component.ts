import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';



@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent {
  hide = true;
  formCreate: any;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService,
    private noti: NotificacionService,
  ) {

    this.reactiveForm();
  }

  ngOnInit(): void {  
    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))

    console.log("HEADER", this.currentUser);
    
    this.formCreate.setValue({
      id: this.currentUser.id,
      password: '',
    })
  }


  reactiveForm() {
    this.formCreate = this.fb.group({
      id: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };

  save(){
    this.makeSubmit = true;
    if(this.formCreate.invalid){
      return;
    }
    this.gService.create('usuario/changePassword', this.formCreate.value)
      .pipe()
      .subscribe(
        (respuesta: any) => {
          this.noti.mensaje(
            'Contraseña actualizada correctamente',
            'Se ha actualizado la contraseña correctamente',
            TipoMessage.success
          );
          this.router.navigate(['/']);
        },
        (error: any) => {
          console.log(error);
          this.noti.mensaje(
            'Error',
            'Ha ocurrido un error al actualizar la contraseña',
            TipoMessage.error
          );
        }
      );
  }

  cancel(){
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
