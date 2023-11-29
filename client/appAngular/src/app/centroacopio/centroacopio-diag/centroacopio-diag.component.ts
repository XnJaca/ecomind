import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MaterialreciclableDiagComponent } from 'src/app/materialreciclable/materialreciclable-diag/materialreciclable-diag.component';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-centroacopio-diag',
  templateUrl: './centroacopio-diag.component.html',
  styleUrls: ['./centroacopio-diag.component.css']
})
export class CentroacopioDiagComponent implements OnInit  {
  datos:any;
  datosDialog:any;
  destroy$:Subject<boolean>= new Subject<boolean>();
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef:MatDialogRef<CentroacopioDiagComponent>,
    private gService:GenericService
    ,private dialog:MatDialog
  ) { 
    this.datosDialog=data;
  }

  ngOnInit(): void {
    this.obtenerCentroAcopio(this.datosDialog.id);
  }

  obtenerCentroAcopio(id:any){
    this.gService
    .get('centroacopio',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
        this.datos=data; 
    });
  }

  detalleMaterialReciclable(id:number){
    //Detalle en formato diálogo
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose=false;
    dialogConfig.data={
      id:id
    };
    this.dialog.open(MaterialreciclableDiagComponent,dialogConfig);
  }

  close(){
    this.dialogRef.close();
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