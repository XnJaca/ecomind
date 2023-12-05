import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { LocationService } from 'src/app/share/location.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-centroacopio-form',
  templateUrl: './centroacopio-form.component.html',
  styleUrls: ['./centroacopio-form.component.css']
})
export class CentroacopioFormComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Crear';
  // listas
  usuarioList: any;
  materialreciclableList: any;
  centrosAcopio: any[] = [];

  // centro acopio a actualizar
  centroacopioInfo: any;
  // respuesta del api
  respCentroAcopio: any;
  // Sí es submit
  submitted = false;
  // nombre del formulario
  centroacopioForm: FormGroup;
  // id del centro acopio
  idCentroAcopio: number = 0;
  // Sí es crear
  isCreate: boolean = true;

  // arrays del api
  provincias: any[] = [];
  cantones: any[] = [];
  distritos: any[] = [];

  provinciaSelected: string; //provincia seleccionada
  cantonSelected: string; //canton seleccionado
  distritoSelected: string; //distrito seleccionado

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private locationService: LocationService,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService
  ) {
    this.formularioReactive();
    this.listaUsuarios();
    this.listaMaterialesReciclables();
    this.locationService.getProvincias().subscribe((data) => {
      this.provincias = this.transformJSONToArray(data);
    });

  }

  ngOnInit(): void {
    // Obtener la lista de centros de acopio y usuarios al inicio
    this.gService.list('centroacopio').subscribe((centros: any) => {
      this.centrosAcopio = centros;

      // Filtrar la lista de usuarios para quitar aquellos que ya tienen un centro asignado
      this.usuarioList = this.usuarioList.filter(usuario => {
        return !this.centrosAcopio.some(centro => centro.administradorId === usuario.id);
      });
    });

    this.activeRouter.params.subscribe((params: Params) => {
      console.log("PARAMSSS", params);

      this.idCentroAcopio = params['id'];
      if (this.idCentroAcopio != undefined && !isNaN(Number(this.idCentroAcopio))) {
        this.isCreate = false;
        this.titleForm = 'Actualizar';
        this.gService.get('centroacopio', this.idCentroAcopio)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            console.log("CENTRO DE ACOPIO", data);

            this.centroacopioInfo = data;
            // Verificar si el administrador está en la lista, si no, agregarlo
            const adminId = this.centroacopioInfo.administradorId;
            if (!this.usuarioList.find(usuario => usuario.id === adminId)) {
              this.usuarioList.push(this.centroacopioInfo.administrador);
            }

            // Mapeo de la propiedad materialReciclable para seleccionar en el formulario
            const materialesSeleccionados = this.centroacopioInfo.materialAceptado.map((item: any) => {
              return item.materialReciclable;
            });
            this.centroacopioForm.setValue({
              id: this.centroacopioInfo.id,
              nombre: this.centroacopioInfo.nombre,
              direccionProvincia: this.centroacopioInfo.direccionProvincia,
              direccionCanton: this.centroacopioInfo.direccionCanton,
              direccionDistrito: this.centroacopioInfo.direccionDistrito,
              direccionExacta: this.centroacopioInfo.direccionExacta,
              telefono: this.centroacopioInfo.telefono,
              horarioAtencion: this.centroacopioInfo.horarioAtencion,
              habilitado: this.centroacopioInfo.habilitado,
              administradorId: this.centroacopioInfo.administradorId,
              materialAceptado: materialesSeleccionados.map((item: any) => item.id),
            });
            // Verificar y asignar la provincia seleccionada
            const provinciaSeleccionada = this.provincias.find(prov => prov.nombre === this.centroacopioInfo.direccionProvincia);
            if (provinciaSeleccionada) {
              this.provinciaSelected = provinciaSeleccionada.id;
              this.centroacopioForm.get('direccionProvincia').setValue(this.provinciaSelected);
            }
          });
      }
    });
  }

  formularioReactive() {
    this.centroacopioForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      direccionProvincia: [null, Validators.required],
      direccionCanton: [null, Validators.required],
      direccionDistrito: [null, Validators.required],
      direccionExacta: [null, Validators.required],
      telefono: [null, Validators.required],
      horarioAtencion: [null, Validators.required],
      habilitado: [true, Validators.required],
      administradorId: [null, Validators.required],
      materialAceptado: [null, Validators.required],
    });

    this.centroacopioForm.patchValue({
      direccionProvincia: this.provinciaSelected,
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.centroacopioForm.controls[control]?.hasError(error);

  };

  // submit del formulario
  submitCentroAcopioForm(): void {
    this.submitted = true;
    if (this.centroacopioForm.invalid) {
      return;
    }
    this.guardarCentroAcopio();
  }

  //guardar centro acopio
  private guardarCentroAcopio() {
    const nombreProvincia = this.provinciaSelected;
    this.centroacopioForm.controls['direccionProvincia'].setValue(nombreProvincia);
    const nombreCanton = this.cantonSelected;
    this.centroacopioForm.controls['direccionCanton'].setValue(nombreCanton);
    const nombreDistrito = this.distritoSelected;
    this.centroacopioForm.controls['direccionDistrito'].setValue(nombreDistrito);

    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if (this.centroacopioForm.invalid) return;
    //Obtener id Generos del Formulario y Crear arreglo con {id: value}
    let gFormat: any = this.centroacopioForm.get('materialAceptado').value
      .map((x: any) => ({ ['materialReciclableId']: x }))

    this.centroacopioForm.controls['materialAceptado'].setValue(gFormat);

    if (this.isCreate) {
      this.gService
        .create('centroacopio', this.centroacopioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respCentroAcopio = data;
          this.noti.mensajeRedirect('Crear Centro de acopio',
            `Centro de acopio creado: ${data.nombre}`,
            TipoMessage.success,
            '/centroacopio/all');
          this.router.navigate(['centroacopio/all']);
        });
    } else {
      this.gService
        .update('centroacopio', this.centroacopioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respCentroAcopio = data;
          this.noti.mensajeRedirect('Actualizar Centro de acopio',
            `Centro de acopio actualizado: ${data.nombre}`,
            TipoMessage.success,
            '/centroacopio/all');
          this.router.navigate(['centroacopio/all']);
        });
    }
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
    console.log(this.centroacopioForm.value.direccionProvincia);

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

  onReset() {
    this.submitted = false;
    this.centroacopioForm.reset();
  }

  onBack() {
    this.router.navigate(['/centroacopio/all']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  // lista de usuarios
  listaUsuarios() {
    this.usuarioList = null;
    this.gService
      .list('usuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        //console.log(data);
        this.usuarioList = data.filter(usuario => usuario.rolId === 1);
      });
  }

  //lista de materiales reciclables
  listaMaterialesReciclables() {
    this.materialreciclableList = null;
    this.gService
      .list('materialreciclable')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        //console.log(data);
        this.materialreciclableList = data;
      });
  }
}
