import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAutenticated: boolean;
  centrosacopio: number;
  currentUser: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  qtyItems: Number = 0;
  constructor(
    private router: Router,
    private cartService: CartService,
    private gService: GenericService,
    private authService: AuthenticationService) {
    this.qtyItems = this.cartService.quantityItems();
  }

  ngOnInit(): void {
    //valores de prueba
    // this.isAutenticated = true;
    // let user = {
    //   name: "Steven Murillo",
    //   email: "murillosteven65@gmail.com",
    //   id: "408620154"

    // }
    // this.currentUser = user; +
    // Suscribción para gestionar la cantidad de items en el carrito
    this.cartService.countItems.subscribe((count) => {
      this.qtyItems = count;
    })

    console.log("HEADER", this.currentUser);


    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))
    //Suscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => (
      this.isAutenticated = valor
    ))



  }

  historialCentroAcopio() {
    this.gService
      .list('centroacopio')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const centrosacopioFiltrados = data.filter((x: any) => x.administradorId === this.currentUser.id);
        // Verificar que centrosacopioFiltrados esté definido y tenga elementos antes de usarlo
        if (centrosacopioFiltrados && centrosacopioFiltrados.length > 0 && 'id' in centrosacopioFiltrados[0]) {
          const centroId = centrosacopioFiltrados[0].id;
          this.canjeMaterial(centroId);
        } else {
          console.error('Error: No se encontró ningún centro de acopio para el administrador.');
        }
      });
  }


  canjeMaterial(id: any) {
    this.router.navigate(['canjematerial/centroacopio', id]);
  }

  centrosAcopioAdministrador() {
    this.router.navigate(['centroacopio/administrador']);
  }

  historialCanjes() {
    this.router.navigate(['canjematerial/cliente']);
  }

  gestionUsuarios(){
    this.router.navigate(['usuario/all']);
  }

  gestionCupones(){
    this.router.navigate(['canjecupon/']);
  }

  changePassword(){
    this.router.navigate(["usuario/changePassword"]);
  }


  login() {
    this.router.navigate(['usuario/login']);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['inicio']);
  }

}
