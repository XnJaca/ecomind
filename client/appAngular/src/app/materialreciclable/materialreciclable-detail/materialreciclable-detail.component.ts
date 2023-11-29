import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-materialreciclable-detail',
  templateUrl: './materialreciclable-detail.component.html',
  styleUrls: ['./materialreciclable-detail.component.css']
})
export class MaterialreciclableDetailComponent {
  datos: any; //Respuesta del API
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService,
    private route:ActivatedRoute) {
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.obtenerMaterialReciclable(Number(id));
      }
  }
  obtenerMaterialReciclable(id: any) {
    this.gService
      .get('materialreciclable', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
