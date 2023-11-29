import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { VideojuegoDiagComponent } from '../videojuego-diag/videojuego-diag.component';

@Component({
  selector: 'app-videojuego-index',
  templateUrl: './videojuego-index.component.html',
  styleUrls: ['./videojuego-index.component.css']
})
export class VideojuegoIndexComponent {
  datos:any; //Respuesta del API
  filterDatos: any;
  destroy$: Subject<boolean>= new Subject<boolean>();

  constructor(private gService: GenericService,
    private dialog:MatDialog, private cartService:CartService, 
    private notificacion:NotificacionService) { 
    this.listarVideojuegos();
  }
  listarVideojuegos(){
    //Solicitud al API para listar todos los videojuegos
    //localhost:3000/videojuego
    this.gService.list('videojuego/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any)=>{
        console.log(response);
        this.datos=response;
        this.filterDatos=this.datos;
      })
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  detalleVideojuego(id:number){
    //Detalle en formato diálogo
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose=false;
    dialogConfig.data={
      id:id
    };
    this.dialog.open(VideojuegoDiagComponent,dialogConfig);
  }
  filterVideojuegos(text: string) {
    if(!text){
      this.filterDatos = this.datos;
    }else{
      this.filterDatos = this.datos.filter(
        videojuego => videojuego?.nombre.toLowerCase().includes(text.toLowerCase())
        );
    }
  }
  comprar(id:number){
    this.gService.list('videojuego/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any)=>{
        this.cartService.addToCart(response)
        // notificar al usuario que se agregó al carrito
        this.notificacion.mensaje('Orden', 
        `Videojuego ${response.nombre} agregado a la orden`, TipoMessage.success)
      })
  }   
}
