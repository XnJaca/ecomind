import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-canjecupon-list',
  templateUrl: './canjecupon-list.component.html',
  styleUrls: ['./canjecupon-list.component.css']
})
export class CanjecuponListComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();

  displayedColumns = ['id', 'nombre', 'categoria','ecoMonedasNecesarias', 'acciones'];

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private paginatorIntl: MatPaginatorIntl,
    private authService: AuthenticationService,
    private location: Location) {
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
    }

    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))
  }

  ngAfterViewInit(): void {
    this.listarCanjeCupon();
  }

  listarCanjeCupon() {
    this.gService.get('cuponCanje/getByUser',this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log(response);
        this.datos = response;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  detalleCupon(id: number) {
    this.router.navigate(['canjecupon/detalle', id]);
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}
