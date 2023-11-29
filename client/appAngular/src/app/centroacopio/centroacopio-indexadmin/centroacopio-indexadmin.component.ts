import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-centroacopio-indexadmin',
  templateUrl: './centroacopio-indexadmin.component.html',
  styleUrls: ['./centroacopio-indexadmin.component.css']
})
export class CentroacopioIndexadminComponent {
  datos:any; //Respuesta del API
  filterDatos: any;
  destroy$: Subject<boolean>= new Subject<boolean>();
  filtro: string = '';

  constructor(private gService: GenericService,
    private route:ActivatedRoute, private router: Router) {
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.listarCentroAcopios(Number(id));
      }
  }

  listarCentroAcopios(id: any){
    this.gService.list('centroacopio/administrador/208440295')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any)=>{
        console.log(response);
        this.datos=response;
        this.filterDatos=this.datos
      })
  }

  canjeMaterial(id: any) {
    this.router.navigate(['canjematerial/centroacopio', id]);
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
  filterCentroAcopios() {
    if(!this.filtro){
      this.filterDatos=this.datos
    }else{
      this.filterDatos=this.datos.filter(
        centroacopio=> 
          centroacopio?.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      )
    }
  }
}
