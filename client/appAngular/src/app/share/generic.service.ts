import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  // URL del API, definida en enviroments->enviroment.ts
  urlAPI: string = environment.apiURL;
  //Información usuario actual
  currentUser: any;

  //Inyectar cliente HTTP para las solicitudes al API
  constructor(private http: HttpClient) {
   
  }
 
  // Listar
  //http://localhost:3000/videojuego
  list(endopoint: string): Observable<any> {
    return this.http.get<any>(this.urlAPI + endopoint);
  }
  // Obtener
  get(endopoint: string, filtro: any): Observable<any | any[]> {
    return this.http.get<any | any[]>(this.urlAPI + endopoint + `/${filtro}`);
  }
  // crear
  create(endopoint: string, objCreate: any | any): Observable<any | any[]> {
    try {
      return this.http.post<any | any[]>(this.urlAPI + endopoint, objCreate)
        .pipe(
          catchError((error) => {
            console.error('Error en la solicitud:', error);
            // Puedes realizar acciones adicionales aquí, como mostrar un mensaje de error al usuario.
            return throwError(() => new Error(error.error.message));
          })
        );
    } catch (error) {
      console.log('Error en el try-catch:', error);
      return throwError(() => new Error(error.error.message));
    }
  }
  // actualizar
  update(endopoint: string, objUpdate: any | any): Observable<any | any[]> {
    return this.http.put<any | any[]>(
      this.urlAPI + endopoint + `/${objUpdate.id}`,
      objUpdate
    );
  }

}
