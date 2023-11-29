import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-orden-index',
  templateUrl: './orden-index.component.html',
  styleUrls: ['./orden-index.component.css']
})
export class OrdenIndexComponent implements OnInit {

  total = 0;
  fecha = Date.now();
  qtyItems = 0;
  //Tabla
  displayedColumns: string[] = ['producto', 'precio', 'cantidad', 'subtotal','acciones'];
  dataSource = new MatTableDataSource<any>();
  constructor(
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
   this.cartService.currentDataCart$.subscribe(data => {
    this.dataSource = new MatTableDataSource(data);
   })
   this.total = this.cartService.getTotal();
  }
  actualizarCantidad(item: any) {
   this.cartService.addToCart(item)
   this.total = this.cartService.getTotal();
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item);
    this.total = this.cartService.getTotal();
  }
  registrarOrden() {
   if(this.cartService.getItems!= null){
    // Obtener los items de la compra
    let itemsCompra= this.cartService.getItems;
    // Esctructura para insertar en la tabla intermedia
    //[{'videojuego_id': valor, 'cantidad': valor}, {'videojuego_id': valor, 'cantidad': valor}]
    let detalle = itemsCompra.map(
      x => ({
        ['videojuegoId']: x.idItem,
        ['cantidad']: x.cantidad
      })
    )
    // Datos a inertar en el API
    let data = {
      'fechaOrden': new Date(this.fecha),
      'usuarioId': 1,
      'videojuegos': detalle
    }
    // Llamar al API para crear una orden
    this.gService.create('orden/', data)
      .subscribe((response:any)=>{
        // notificar al usuario que se agregó al carrito
        this.noti.mensaje('Orden', 
        `Orden registrada ${response.id}`, TipoMessage.success)
        this.cartService.deleteCart();
        this.total = this.cartService.getTotal();
      })
   }else{
    this.noti.mensaje('Orden', 'No hay productos en el carrito', TipoMessage.warning);
   }
  }
}

