import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { CentroacopioDiagComponent } from '../centroacopio-diag/centroacopio-diag.component';

@Component({
  selector: 'app-centroacopio-index',
  templateUrl: './centroacopio-index.component.html',
  styleUrls: ['./centroacopio-index.component.css']
})
export class CentroacopioIndexComponent {
  datos: any; //Respuesta del API
  filterDatos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  filtro: string = '';

  constructor(
    private gService: GenericService,
    private dialog: MatDialog, private cartService: CartService,
    private noti: NotificacionService) {
    this.listarCentroAcopios();
  }

  listarCentroAcopios() {
    this.gService.list('centroacopio/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log(response);
        this.datos = response.filter((centroacopio: any) => centroacopio.habilitado == true);
        this.filterDatos = this.datos
      })
  }

  detalleCentroAcopio(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id
    };
    this.dialog.open(CentroacopioDiagComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  filterCentroAcopios() {
    if (!this.filtro) {
      this.filterDatos = this.datos;
    } else {
      this.filterDatos = this.datos.filter(
        centroacopio => {
          // Filtrar por nombre, provincia y/o material aceptado
          const nombreIncluido = centroacopio?.nombre.toLowerCase().includes(this.filtro.toLowerCase());
          const provinciaIncluida = centroacopio?.direccionProvincia.toLowerCase().includes(this.filtro.toLowerCase());
          const materialAceptadoIncluido = centroacopio?.materialAceptado.some(
            material => material.materialReciclable.nombre.toLowerCase().includes(this.filtro.toLowerCase())
          );

          // Retornar true si se cumple al menos una de las condiciones (nombre, provincia o material aceptado)
          return nombreIncluido || provinciaIncluida || materialAceptadoIncluido;
        }
      );
    }
  }

}
