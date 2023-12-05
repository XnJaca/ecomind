import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GenericService } from 'src/app/share/generic.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { LocationService } from 'src/app/share/location.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  hide = true;
  usuario: any;
  roles: any;
  formCreate: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  centrosAcopio: any[] = [];
  provincias: any[] = [];

  cantones: any[] = [];
  distritos: any[] = [];

  provinciaSelected: string; //provincia seleccionada
  cantonSelected: string; //canton seleccionado
  distritoSelected: string; //distrito seleccionado

  currentUser: any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService,
    private noti: NotificacionService,
    private locationService: LocationService
  ) {
    
    this.reactiveForm();

    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))

    this.locationService.getProvincias().subscribe((data) => {
      console.log(data);
      
      this.provincias = this.transformJSONToArray(data);
    });

  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      identificacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      direccionProvincia: [null, Validators.required],
      direccionCanton: [null, Validators.required],
      direccionDistrito: [null, Validators.required],
      direccionExacta: [null, Validators.required],
      rolId: [null],
      centroAcopioId: [null],
    });
    this.getRoles();
    this.getCentrosAcopio();
  }
  ngOnInit(): void {
    
  }

  submitForm() {
    this.makeSubmit = true;
    //Validación
    if (this.currentUser !=null && this.formCreate.invalid || this.currentUser != null && this.formCreate.controls['centroAcopioId'].value == null) {
      return;
    }

    if (this.currentUser == null && this.formCreate.invalid) {
      return;
    }
    //Registrar usuario
    this.authService.createUser(this.formCreate.value)
      .subscribe((respuesta: any) => {
        this.noti.mensajeRedirect(
          'Usuario', 'Usuario creado ',
          TipoMessage.success, '/')
        this.router.navigate(['/usuario/all'])
      })
  }

  private transformJSONToArray(jsonData: any): any[] {
    return Object.keys(jsonData).map((key) => ({
      id: key,
      nombre: jsonData[key],
    }));
  }


  onProvinceChange(provinceId: any): void {
    console.log(provinceId);

    //se obtiene el nombre de la provincia
    const selectedProvince = this.provincias.find(
      (provincia) => provincia.id === provinceId
    );
    this.provinciaSelected = selectedProvince ? selectedProvince.nombre : '';
    console.log(this.formCreate.value.direccionProvincia);

    //se envía provinciaId al servicio para obtener la lista de cantones
    this.locationService
      .getCantonesByProvincia(parseInt(provinceId))
      .subscribe((data) => {
        this.cantones = this.transformJSONToArray(data);
        this.distritos = [];
      });
  }

  onCantonChange(provinceId: any, cantonId: any): void {
    //se obtiene el nombre del canton
    const selectedCanton = this.cantones.find(
      (canton) => canton.id === cantonId
    );
    this.cantonSelected = selectedCanton ? selectedCanton.nombre : '';
    //se envía provinciaId y cantonId al servicio para obtener la lista de distritos
    this.locationService
      .getDistritosByCanton(parseInt(provinceId), parseInt(cantonId))
      .subscribe((data) => {
        this.distritos = this.transformJSONToArray(data);
      });
  }

  onDistritoChange(distritoId: any): void {
    const selectedDistrito = this.distritos.find(
      (distrito) => distrito.id === distritoId
    );
    this.distritoSelected = selectedDistrito ? selectedDistrito.nombre : '';
  }

  onCentroAcopioChange(centroAcopioId: any): void {
    console.log(centroAcopioId);
  }



  onReset() {
    this.formCreate.reset();
  }

  getRoles() {
    this.gService
      .list('rol')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.roles = data;
        console.log(this.roles);
      });
  }

  getCentrosAcopio() {
    this.gService
      .list('centroacopio')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.centrosAcopio = data;
        console.log(this.centrosAcopio);
      });
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };
}
