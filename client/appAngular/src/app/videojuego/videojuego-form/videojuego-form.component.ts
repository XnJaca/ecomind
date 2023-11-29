import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-videojuego-form',
  templateUrl: './videojuego-form.component.html',
  styleUrls: ['./videojuego-form.component.css'],
})
export class VideojuegoFormComponent implements OnInit {
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';
  //Lista de generos
  generosList: any;
  //Videojuego a actualizar
  videojuegoInfo: any;
  //Respuesta del API crear/modificar
  respVideojuego: any;
  //Sí es submit
  submitted = false;
  //Nombre del formulario
  videojuegoForm: FormGroup;
  //id del Videojuego
  idVideojuego: number = 0;
  //Sí es crear
  isCreate: boolean = true;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService
  ) {
    this.formularioReactive();
    this.listaGeneros();
  }
  ngOnInit(): void {
    //Verificar sí hay parámetros en la URL
    this.activeRouter.params.subscribe((params:Params)=>{
      //Obtener el id del Videojuego de los parámetros
      this.idVideojuego=params['id'];
      if(this.idVideojuego != undefined && !isNaN(Number(this.idVideojuego))){
        //Precargar los datos
        this.isCreate=false;
        this.titleForm='Actualizar';
        //Obtener el videojuego a actualizar
        this.gService
          .get('videojuego', this.idVideojuego)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any)=>{
            this.videojuegoInfo=data;
            console.log(this.videojuegoInfo)
            //Precargar los datos en el formulario
            this.videojuegoForm.setValue({
              id: this.videojuegoInfo.id,
              nombre: this.videojuegoInfo.nombre,
              descripcion: this.videojuegoInfo.descripcion,
              precio: this.videojuegoInfo.precio,
              publicar: this.videojuegoInfo.publicar,
              generos: this.videojuegoInfo.generos.map(({id})=>id),
            })
          })
      }
    })
  }
  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.videojuegoForm=this.fb.group({
      id: [null, null],
      nombre:[
        null,
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      descripcion:[null, Validators.required],
      precio:[null, 
        Validators.compose([Validators.required,
          //\d+([.]\d+)?
          Validators.pattern(this.numRegex)])
      ],
      publicar:[true, Validators.required],
      generos:[null, Validators.required]

    })
  }
  listaGeneros() {
    this.generosList = null;
    this.gService
      .list('genero')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.generosList = data;
      });
  }

  public errorHandling = (control: string, error: string) => {
    return this.videojuegoForm.controls[control].hasError(error);
  };
  submitVideojuego(): void {

    console.log(this.videojuegoForm.value)
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.videojuegoForm.invalid) return;
    //Obtener id Generos del Formulario y Crear arreglo con {id: value}
    let gFormat: any= this.videojuegoForm.get('generos').value
                      .map((x: any) => ( { ['id']: x }) )
                      //[{id: 5},{id: 3}] (())=>{}  (())=>()
    //Asignar valor al formulario patchValue/setValue
    this.videojuegoForm.patchValue({generos: gFormat})
    console.log(this.videojuegoForm.value)
    if (this.isCreate) {
      //Accion API create enviando toda la informacion del formulario
      this.gService
        .create('videojuego',this.videojuegoForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data:any)=>{
          //Obtener respuesta
          this.respVideojuego=data;
          this.noti.mensajeRedirect('Crear Videojuego',
              `Videojuego creado: ${data.nombre}`,
              TipoMessage.success,
              '/videojuego/all');
          this.router.navigate(['/videojuego/all'])
        })
    } else {
      //Accion API actualizar enviando toda la informacion del formulario
      this.gService
        .update('videojuego',this.videojuegoForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data:any)=>{
          //Obtener respuesta
          this.respVideojuego=data;
          this.noti.mensajeRedirect('Actualizar Videojuego',
              `Videojuego actualizado: ${data.nombre}`,
              TipoMessage.success,
              '/videojuego/all');
          this.router.navigate(['/videojuego/all'])
        })
    }
  }
  onReset() {
    this.submitted = false;
    this.videojuegoForm.reset();
  }
  onBack() {
    this.router.navigate(['/videojuego/all']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }
}
