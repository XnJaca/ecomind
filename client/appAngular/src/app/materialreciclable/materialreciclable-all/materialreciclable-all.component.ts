import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MaterialreciclableDiagComponent } from '../materialreciclable-diag/materialreciclable-diag.component';

@Component({
  selector: 'app-materialreciclable-all',
  templateUrl: './materialreciclable-all.component.html',
  styleUrls: ['./materialreciclable-all.component.css']
})
export class MaterialreciclableAllComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'unidadmedida', 'precioecomoneda','acciones'];

  constructor(private gService: GenericService, 
    private router: Router,
    private route: ActivatedRoute,
    private paginatorIntl: MatPaginatorIntl,
    private dialog:MatDialog,
    private location: Location )
  {
    this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
    this.paginatorIntl.nextPageLabel = 'Siguiente página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';

    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  ngAfterViewInit(): void {
    this.listarMaterialReciclable();   
  }
  listarMaterialReciclable(){
    //Solicitud al API para listar todos los videojuegos
    //localhost:3000/videojuego
    this.gService.list('materialreciclable/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any)=>{
        console.log(response);
        this.datos=response;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      })
  }
  detalleMaterialReciclable(id: number){
    //Detalle en formato diálogo
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose=false;
    dialogConfig.data={
      id:id
    };
    this.dialog.open(MaterialreciclableDiagComponent,dialogConfig);
  }
  actualizarMaterialReciclable(id: number) {
    this.router.navigate(['/materialreciclable/update', id], {
      relativeTo: this.route,
    });
  }

  crearMaterialReciclable() {
    this.router.navigate(['/materialreciclable/create'], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  goBack(): void {
    this.location.back();
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
