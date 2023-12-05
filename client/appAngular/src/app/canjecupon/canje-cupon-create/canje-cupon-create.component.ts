import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-canje-cupon-create',
  templateUrl: './canje-cupon-create.component.html',
  styleUrls: ['./canje-cupon-create.component.css']
})
export class CanjeCuponCreateComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Crear';
  submitted = false;
  formCreate: FormGroup;
  idCupon: number = 0;
  isCreate: boolean = true;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  respCuponCanje: any;


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
      this.idCupon = params['id'];

      if (this.idCupon != undefined && !isNaN(Number(this.idCupon))) {
        this.isCreate = false;

        this.titleForm = 'Actualizar';

        this.gService
          .get('cuponCanje', this.idCupon)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.respCuponCanje = data;
            this.formCreate.setValue({
              id: this.respCuponCanje.id,
              nombre: this.respCuponCanje.nombre,
              descripcion: this.respCuponCanje.descripcion,
              imagenURL: this.respCuponCanje.imagenURL,
              categoria: this.respCuponCanje.categoria,
              fechaInicio: this.respCuponCanje.fechaInicio,
              fechaFinal: this.respCuponCanje.fechaFinal,
              ecoMonedasNecesarias: this.respCuponCanje.ecoMonedasNecesarias,
              image: this.respCuponCanje.image
            });
          });

      }
    }
    )
  }

  formularioReactive() {
    this.formCreate = this.fb.group({
      id: [null],
      nombre: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      descripcion: [null, Validators.required],
      categoria: [null, Validators.required],
      ecoMonedasNecesarias: [null, Validators.compose([Validators.pattern(this.numRegex)])],
      fechaInicio: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      imagenURL: [null, Validators.required],
      image: [null, Validators.required]
    });
  }

  submitCupon(): void {
    this.submitted = true;
    if (this.formCreate.invalid) return;

    if (this.formCreate.invalid) return;

    const ecoMonedasNecesariasValue = this.formCreate.controls['ecoMonedasNecesarias'].value;

    console.log(ecoMonedasNecesariasValue);
    
    // Verificar si el valor ingresado es un número
    if (ecoMonedasNecesariasValue == null || isNaN(ecoMonedasNecesariasValue)) {
      // Mostrar notificación de error
      this.noti.mensaje('Error', 'Ingrese un número válido para Eco monedas necesarias', TipoMessage.error);
      //focus en el campo
      this.formCreate.controls['ecoMonedasNecesarias'].setErrors({ 'pattern': true });
      return;
    }

    if (this.isCreate) {
      this.gService
        .create('cuponcanje', this.formCreate.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respCuponCanje = data;
          this.noti.mensajeRedirect('Crear Cupon',
            `Cupon creado: ${data.nombre}`,
            TipoMessage.success,
            '/canjecupon');
          this.router.navigate(['/canjecupon']);
        });
    } else {
      this.gService
        .update('cuponcanje', this.formCreate.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respCuponCanje = data;
          this.noti.mensajeRedirect('Actualizar Cupon',
            `Cupon actualizado: ${data.nombre}`,
            TipoMessage.success,
            '/canjecupon');
          this.router.navigate(['/canjecupon']);
        });
    }
  }


  public errorHandling = (control: string, error: string) => {
    return this.formCreate.controls[control].hasError(error);
  };


  handleImageInput(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];
        this.formCreate.patchValue({
          imagenURL: file.name,
          image: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  }


  onReset() {
    this.submitted = false;
    this.formCreate.reset();
  }

  onBack() {
    this.router.navigate(['/canjecupon']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
