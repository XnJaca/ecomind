import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-videojuego-diag',
  templateUrl: './videojuego-diag.component.html',
  styleUrls: ['./videojuego-diag.component.css']
})
export class VideojuegoDiagComponent implements OnInit{
  datos:any;
  datosDialog:any;
  destroy$:Subject<boolean>= new Subject<boolean>();
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef:MatDialogRef<VideojuegoDiagComponent>,
    private gService:GenericService
  ) { 
    this.datosDialog=data;
  }

  ngOnInit(): void {
    if(this.datosDialog.id){
      this.obtenerVideojuego(this.datosDialog.id);
    }
  }
  obtenerVideojuego(id:any){
    this.gService
    .get('videojuego',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
        this.datos=data; 
    });
   
  }
  close(){
    //Dentro de close ()
     //this.form.value 
    this.dialogRef.close();
  }
}
