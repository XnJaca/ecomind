import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Location } from '@angular/common';

@Component({
  selector: 'app-canjematerial-detail',
  templateUrl: './canjematerial-detail.component.html',
  styleUrls: ['./canjematerial-detail.component.css']
})
export class CanjematerialDetailComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['material', 'unidadmedida','precioEcomoneda', 'cantidad','subtotal', ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private location: Location
  ) {}

  ngAfterViewInit(): void {
    let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.getCanjeMaterial(Number(id));
      }
  }
  getCanjeMaterial(id:any) {
    this.gService
      .get('canjematerial/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        this.dataSource = new MatTableDataSource(this.datos.detalleCanjeMaterial);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
