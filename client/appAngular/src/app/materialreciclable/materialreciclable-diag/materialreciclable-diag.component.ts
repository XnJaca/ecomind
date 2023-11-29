import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-materialreciclable-diag',
  templateUrl: './materialreciclable-diag.component.html',
  styleUrls: ['./materialreciclable-diag.component.css']
})
export class MaterialreciclableDiagComponent implements OnInit {
  datos:any;
  datosDialog:any;
  destroy$:Subject<boolean>= new Subject<boolean>();
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef:MatDialogRef<MaterialreciclableDiagComponent>,
    private gService:GenericService
  ) { 
    this.datosDialog=data;
  }

  ngOnInit(): void {
    this.obtenerMaterialreciclable(this.datosDialog.id);
  }

  obtenerMaterialreciclable(id:any){
    this.gService
    .get('materialreciclable',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
        this.datos=data; 
    });
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

  close(){
    this.dialogRef.close();
  }
}
