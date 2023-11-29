import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VideojuegoAllDataSource, VideojuegoAllItem } from './videojuego-all-datasource';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-videojuego-all',
  templateUrl: './videojuego-all.component.html',
  styleUrls: ['./videojuego-all.component.css']
})
export class VideojuegoAllComponent implements AfterViewInit {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['nombre', 'precio','acciones'];

  constructor(private gService: GenericService, 
    private router: Router,
    private route: ActivatedRoute)
  {

  }

  ngAfterViewInit(): void {
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
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      })
  }
  detalleVideojuego(id: number){
    this.router.navigate(['/videojuego',id],
      {
        relativeTo:this.route
      }
    )
  }
  actualizarVideojuego(id: number) {
    this.router.navigate(['/videojuego/update', id], {
      relativeTo: this.route,
    });
  }

  crearVideojuego() {
    this.router.navigate(['/videojuego/create'], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
