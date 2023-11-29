import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { MaterialreciclableDiagComponent } from '../materialreciclable-diag/materialreciclable-diag.component';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-materialreciclable-index',
  templateUrl: './materialreciclable-index.component.html',
  styleUrls: ['./materialreciclable-index.component.css']
})

export class MaterialreciclableIndexComponent {
  datos: any; //Respuesta del API
  filterDatos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  filtro: string = '';
  isAutenticated: boolean;

  constructor(private gService: GenericService,
    private dialog: MatDialog, private cartService: CartService,
    private notificacion: NotificacionService, private authService: AuthenticationService) {
    this.listarMaterialesReciclables();
  }

  listarMaterialesReciclables() {
    this.gService.list('materialreciclable/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log(response);
        this.datos = response;
        this.filterDatos = this.datos;
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((valor) => (
      this.isAutenticated = valor
    ))
  }
  

  detalleMaterialReciclable(id: number) {
    //Detalle en formato diálogo
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id
    };
    this.dialog.open(MaterialreciclableDiagComponent, dialogConfig);
  }

  filterMaterialReciclable() {
    if (!this.filtro) {
      this.filterDatos = this.datos;
    } else {
      this.filterDatos = this.datos.filter(
        materialreciclable => materialreciclable?.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }
  }

  comprar(id: number) {
    this.gService.get('materialreciclable/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.cartService.addToCart(response)
        // notificar al usuario que se agregó al carrito
        this.notificacion.mensaje('Orden',
          `Material Reciclable: ${response.nombre} agregado a la orden`, TipoMessage.success)
      })
  }

  obtenerColorRepresentativo(color: string): string {
    switch (color.toLowerCase()) {
      case 'azul':
        return '#3498db'; // Azul
      case 'café':
        return '#8B4513'; // Café
      case 'verde':
        return '#2ecc71'; // Verde
      case 'rojo':
        return '#e74c3c'; // Rojo
      case 'amarillo':
        return '#f39c12'; // Amarillo
      case 'morado':
        return '#9b59b6'; // Morado
      case 'naranja':
        return '#e67e22'; // Naranja
      case 'gris':
        return '#95a5a6'; // Gris
      case 'rosado':
        return '#e84393'; // Rosa
      case 'turquesa':
        return '#17a589'; // Turquesa
      case 'negro':
        return '#000000'; // Negro
      case 'blanco':
        return '#ffffff'; // Blanco
      case 'dorado':
        return '#ffd700'; // Dorado
      case 'plata':
        return '#c0c0c0'; // Plata
      case 'azulmarino':
        return '#001f3f'; // Azul marino
      default:
        return '#ffffff';
    }
  }

}
