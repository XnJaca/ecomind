import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CentroacopioDiagComponent } from '../centroacopio-diag/centroacopio-diag.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-centroacopio-all',
  templateUrl: './centroacopio-all.component.html',
  styleUrls: ['./centroacopio-all.component.css']
})
export class CentroacopioAllComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();

  displayedColumns = ['nombre', 'direccion', 'telefono','acciones'];

  constructor(
    private gService: GenericService, 
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
    this.listarCentroAcopio();   
  }

  listarCentroAcopio(){
    this.gService.list('centroacopio/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any)=>{
        this.datos = response;
        this.dataSource.data = this.datos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  detalleCentroAcopio(id: number){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose=false;
    dialogConfig.data={
      id:id
    };
    this.dialog.open(CentroacopioDiagComponent,dialogConfig);
  }

  actualizarCentroAcopio(id: number){
    this.router.navigate(['/centroacopio/update', id],{
      relativeTo: this.route
    });
  }

  crearCentroAcopio(){
    this.router.navigate(['/centroacopio/create'],{
      relativeTo: this.route
    });
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}
