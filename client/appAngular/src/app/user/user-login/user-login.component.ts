import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  hide=true;
  formulario: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;
  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private noti: NotificacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reactiveForm();
  }
  // Definir el formulario con su reglas de validación
  reactiveForm() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    
  }

  onReset() {
    this.formulario.reset();
  }
  submitForm() {
    this.makeSubmit=true;
    //Validación
    if(this.formulario.invalid){
     return;
    }
    //Login API
    this.authService.loginUser(this.formulario.value)
    .subscribe((respuesta:any)=>{
      console.log("RESPUESTA", respuesta.source._value);
      this.noti.mensaje(
        'Usuario', `Usuario logueado: ${ respuesta.source._value.nombreCompleto}`, 
        TipoMessage.success)

        if (respuesta.source._value.role.id == 2) {
          this.router.navigate(['/inicio/cliente']);
        }else if (respuesta.source._value.role.id == 1) {
          this.router.navigate(['/inicio/admin']);
        }else{
          this.router.navigate(['/inicio/']);
        }
    })
  }
  /* Manejar errores de formulario en Angular */

  public errorHandling = (control: string, error: string) => {
    return (
      this.formulario.controls[control].hasError(error) &&
      this.formulario.controls[control].invalid &&
      (this.makeSubmit || this.formulario.controls[control].touched)
    );
  };
}
