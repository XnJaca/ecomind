import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-videojuego-detail',
  templateUrl: './videojuego-detail.component.html',
  styleUrls: ['./videojuego-detail.component.css'],
})
export class VideojuegoDetailComponent {
  datos: any; //Respuesta del API
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService,
    private route:ActivatedRoute) {
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.obtenerVideojuego(Number(id));
      }
  }
  obtenerVideojuego(id: any) {
    this.gService
      .get('videojuego', id)
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
