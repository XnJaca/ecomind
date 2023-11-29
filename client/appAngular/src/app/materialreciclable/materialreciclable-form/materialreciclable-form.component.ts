import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-materialreciclable-form',
  templateUrl: './materialreciclable-form.component.html',
  styleUrls: ['./materialreciclable-form.component.css']
})
export class MaterialreciclableFormComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Crear';
  generosList: any;
  materialreciclableInfo: any;
  respMaterialreciclable: any;
  submitted = false;
  materialreciclableForm: FormGroup;
  idMaterialReciclable: number = 0;
  isCreate: boolean = true;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  coloresExistente: string[] = [];

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService
  ) {
    this.formularioReactive();
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idMaterialReciclable = params['id'];
      if (this.idMaterialReciclable != undefined && !isNaN(Number(this.idMaterialReciclable))) {
        this.isCreate = false;
        this.titleForm = 'Actualizar';
        this.gService
          .get('materialreciclable', this.idMaterialReciclable)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.materialreciclableInfo = data;
            this.materialreciclableForm.setValue({
              id: this.materialreciclableInfo.id,
              nombre: this.materialreciclableInfo.nombre,
              descripcion: this.materialreciclableInfo.descripcion,
              precioEcoMoneda: this.materialreciclableInfo.precioEcoMoneda,
              unidadMedida: this.materialreciclableInfo.unidadMedida,
              colorRepresentativo: this.materialreciclableInfo.colorRepresentativo,
              imagenURL: this.materialreciclableInfo.imagenURL,
              image: this.materialreciclableInfo.image
            });
          });
      }
    });

    this.gService.list('materialreciclable/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.coloresExistente = response.map((material: any) => material.colorRepresentativo.toLowerCase());
      });
  }

  formularioReactive() {
    this.materialreciclableForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      descripcion: [null, Validators.required],
      precioEcoMoneda: [null, Validators.compose([Validators.required, Validators.pattern(this.numRegex)])],
      unidadMedida: [null, Validators.required],
      colorRepresentativo: [null, Validators.required],
      imagenURL: [null, Validators.required],
      image: [null, Validators.required]
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.materialreciclableForm.controls[control].hasError(error);
  };

  handleImageInput(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    if (file) {
      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];
        this.materialreciclableForm.patchValue({
          imagenURL: file.name,
          image: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  }

  submitMaterialReciclable(): void {
    this.submitted = true;
    if (this.materialreciclableForm.invalid) return;

    const colorRepresentativo = this.materialreciclableForm.get('colorRepresentativo').value.toLowerCase();

    if (!this.isCreate && colorRepresentativo === this.materialreciclableInfo.colorRepresentativo.toLowerCase()) {
      this.guardarMaterialReciclable();
      return;
    }

    if (this.coloresExistente.includes(colorRepresentativo)) {
      this.noti.mensaje('Error', 'El color ya existe en la base de datos.', TipoMessage.error);
      return;
    }

    this.guardarMaterialReciclable();
  }

  private guardarMaterialReciclable() {
    if (this.isCreate) {
      this.gService
        .create('materialreciclable', this.materialreciclableForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respMaterialreciclable = data;
          this.noti.mensajeRedirect('Crear Material Reciclable',
            `Material Reciclable creado: ${data.nombre}`,
            TipoMessage.success,
            '/materialreciclable/all');
          this.router.navigate(['/materialreciclable/all']);
        });
    } else {
      this.gService
        .update('materialreciclable', this.materialreciclableForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respMaterialreciclable = data;
          this.noti.mensajeRedirect('Actualizar Material Reciclable',
            `Material Reciclable actualizado: ${data.nombre}`,
            TipoMessage.success,
            '/materialreciclable/all');
          this.router.navigate(['/materialreciclable/all']);
        });
    }
  }

  onReset() {
    this.submitted = false;
    this.materialreciclableForm.reset();
  }

  onBack() {
    this.router.navigate(['/materialreciclable/all']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}