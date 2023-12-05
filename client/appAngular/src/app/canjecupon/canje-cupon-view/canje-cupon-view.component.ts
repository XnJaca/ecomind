import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-canje-cupon-view',
  templateUrl: './canje-cupon-view.component.html',
  styleUrls: ['./canje-cupon-view.component.css']
})
export class CanjeCuponViewComponent {
  datos: any[] = [];
  currentUser: any;
  // filterDatos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  filtro: string = '';


  constructor(
    private gService: GenericService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private noti: NotificacionService,
    private authService: AuthenticationService) {
    this.listaCupones();

    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))
  }

  listaCupones() {
    this.gService.list('cuponCanje/getValids')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log(response);
        this.datos = response;
      })
  }

  canjearCupon(id: number) {

    const cupon = this.datos.find(c => c.id == id);

    const obj = {
      usuarioId: this.currentUser.id,
      cuponCanjeId: cupon.id,
    }

    this.gService.create('cuponCanje/canjearCupon', obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log(response);

        const msg = response.message;
        this.currentUser.ecoMonedas = response.data.monedas;
        this.noti.mensaje("Canjear Cupon", msg, TipoMessage.success);
      })
  }

  verHistorial() {
    const idUsuario = this.currentUser.id;
    this.router.navigate(['/canjecupon/historial', idUsuario], { relativeTo: this.route });
  }

}
