import { AfterViewInit, Component,OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-canjecupon-index',
  templateUrl: './canjecupon-index.component.html',
  styleUrls: ['./canjecupon-index.component.css']
})
export class CanjecuponIndexComponent implements OnInit {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = ['Id', 'Descripcion', 'Eco Monedas',"Fecha Inicio","Fecha Final", 'acciones'];


  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private paginatorIntl: MatPaginatorIntl,
    private location: Location
  ){
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

  ngOnInit(): void {
   this.listaCanjeCupon();
  }

  listaCanjeCupon(){
    this.gService.list('cuponCanje/')
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: any) => {
      this.datos = response;
      console.log(this.datos);
      
      this.dataSource.data = this.datos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  crearCanjeCupon(){
    this.router.navigate(['canjecupon/create']);
  }

  validateInput(event: any): void {
    const inputValue = event.target.value;
  
    // Remueve caracteres no numéricos
    const numericValue = inputValue.replace(/[^0-9]/g, '');
  
    // Actualiza el valor en el campo
    event.target.value = numericValue;
  }

  actualizarCanjeCupon(id: number){
    this.router.navigate(['canjecupon/update', id]);
  }

  // eliminarCanjeCupon(id: number){
  //   this.gService.delete('canjecupon/', id)
  //   .subscribe((response: any) => {
  //     this.listaCanjeCupon();
  //   });
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }


}
