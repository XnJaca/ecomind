import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-canjematerial-index',
  templateUrl: './canjematerial-index.component.html',
  styleUrls: ['./canjematerial-index.component.css']
})
export class CanjematerialIndexComponent implements OnInit {
  isAutenticated: boolean;
  total = 0;
  fecha = Date.now();
  qtyItems = 0;
  usuarioList: any;
  currentUser: any;
  userSelect: any;
  canjeMaterialForm: FormGroup;
  cartItems: number = 0;
  clienteId: number;
  //Tabla
  displayedColumns: string[] = ['producto', 'precio', 'cantidad', 'subtotal', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  constructor(
    public fb: FormBuilder,
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.formularioReactive();
    this.listaUsuarios();
  }

  ngOnInit(): void {
    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))
    //Suscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => (
      this.isAutenticated = valor
    ))


    //Si no esta autenticado redirecciona al login
    if (!this.isAutenticated) {
      this.router.navigate(['usuario/login']);
    }

    this.cartService.currentDataCart$.subscribe(data => {
      console.log("SERVICE DATA", data);

      this.dataSource = new MatTableDataSource(data);

      //Set cartItems
      this.cartItems = data.length;
      // this.agregarControlesAlFormulario();  // Llama aquí para agregar controles después de actualizar dataSource
    })


    this.total = this.cartService.getTotal();
  }
  actualizarCantidad(item: any) {
    console.log("ITEM ACTUALIZAR", item);
    if (item.cantidad == null) {
      this.noti.mensaje('Error', 'Debe ingresar una cantidad valida.', TipoMessage.error);
      return;
    }
    this.cartService.addToCart(item)
    this.total = this.cartService.getTotal()
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item)
    this.total = this.cartService.getTotal()
  }
  

  public setSelectedUser = (user: any) => {
    this.userSelect = user;
    console.log("USER SELECT", this.userSelect);
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
        centroAcopioId: this.currentUser.centroAcopio.id,
        total: this.cartService.getTotal(),
        detalleCanjeMaterial: detalle,
      };
      //Llamar al API para crear una orden
      this.gService.create('canjeMaterial', datosInsert)
        .subscribe({
          next: (response: any) => {
            console.log("CANJE MATERIAL RESPONSE", response);
            this.noti.mensajeRedirect('Exito', 'CanjeMaterial registrado correctamente',
              TipoMessage.success, '/materialreciclable/index');
            this.router.navigate(['/materialreciclable/index']);
            this.cartService.deleteCart();
          },
          error: (error: any) => {
            console.error("Error en la solicitud:", error.message);
            // Muestra un mensaje de error utilizando el servicio de notificación y el tipo de mensaje de error.
            this.noti.mensaje('Error', error, TipoMessage.error);
          }
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

  // agregarControlesAlFormulario() {
  //   for (const item of this.dataSource.data) {
  //     item.cantidadControl = this.fb.control(item.cantidad, Validators.min(1));
  //     this.canjeMaterialForm.addControl(`cantidad_${item.idItem}`, item.cantidadControl);
  //   }
  // }

  listaUsuarios() {
    this.gService
      .list('usuario/clients')
      .subscribe((data: any) => {
        console.log(data);
        this.usuarioList = data;
      });
  }
}
