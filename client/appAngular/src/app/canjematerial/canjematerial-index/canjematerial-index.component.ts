import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-canjematerial-index',
  templateUrl: './canjematerial-index.component.html',
  styleUrls: ['./canjematerial-index.component.css']
})
export class CanjematerialIndexComponent implements OnInit {

  total = 0;
  fecha = Date.now();
  qtyItems = 0;
  usuarioList: any;
  canjeMaterialForm: FormGroup;
  clienteId: number;
  //Tabla
  displayedColumns: string[] = ['producto', 'precio', 'cantidad', 'subtotal', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  constructor(
    public fb: FormBuilder,
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router
  ) {
    this.formularioReactive();
    this.listaUsuarios();
  }

  ngOnInit(): void {
    this.cartService.currentDataCart$.subscribe(data => {
      console.log("SERVICE DATA", data);

      this.dataSource = new MatTableDataSource(data)
      this.agregarControlesAlFormulario();  // Llama aquí para agregar controles después de actualizar dataSource
    })
    this.total = this.cartService.getTotal();
  }
  actualizarCantidad(item: any) {
    this.cartService.addToCart(item)
    this.total = this.cartService.getTotal()
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item)
    this.total = this.cartService.getTotal()
  }

  public errorHandling = (control: string, error: string) => {
    return this.canjeMaterialForm.controls[control]?.hasError(error);

  };

  registrarCanje() {
    if (this.cartService.getItems != null) {
      //Obtener los items de la compra
      let itemsCompra = this.cartService.getItems;
      console.log("ITEMS COMPRA", itemsCompra);

      //Estructura para insertar en la tabla intermedia

      let detalle = itemsCompra.map(x => ({
        canjeMaterialId: null,  // Puedes dejar esto como null y se asignará automáticamente en la API
        materialReciclableId: x.idItem,
        cantidad: x.cantidad,
        subtotal: x.subtotal,  // Asegúrate de que esta propiedad exista en tus itemsCompra
      }));

      // Datos a insertar en el API
      let datosInsert = {
        usuarioId: this.clienteId, // Cambia esto según tus necesidades
        centroAcopioId: 1,  // Cambia esto según tus necesidades
        total: this.cartService.getTotal(),
        detalleCanjeMaterial: detalle,
      };
      //Llamar al API para crear una orden
      this.gService.create('canjeMaterial', datosInsert)
        .subscribe((response: any) => {
          // Notificar el registro
          this.noti.mensaje('CanjeMaterial',
            `CanjeMaterial registrado # ${response.id}`,
            TipoMessage.success);
          this.cartService.deleteCart();
        });
    } else {
      this.noti.mensaje('Orden', 'Agregue materiales a la orden',
        TipoMessage.warning)
    }
  }


  formularioReactive() {
    this.canjeMaterialForm = this.fb.group({
      clienteId: [null, Validators.required],
    });
  }

  confirmarCliente() {
    const clienteId = this.canjeMaterialForm.get('clienteId').value;

    if (clienteId) {
      this.clienteId = clienteId;
      console.log('Cliente confirmado:', this.clienteId);
    }
  }

  agregarControlesAlFormulario() {
    for (const item of this.dataSource.data) {
      item.cantidadControl = this.fb.control(item.cantidad, Validators.min(1));
      this.canjeMaterialForm.addControl(`cantidad_${item.idItem}`, item.cantidadControl);
    }
  }

  listaUsuarios() {
    this.gService
      .list('usuario/clients')
      .subscribe((data: any) => {
        console.log(data);
        this.usuarioList = data;
      });
  }
}
