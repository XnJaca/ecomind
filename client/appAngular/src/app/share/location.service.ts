import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = 'https://ubicaciones.paginasweb.cr'; 

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/provincias.json`);
  }

  getCantonesByProvincia(provinciaId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/provincia/${provinciaId}/cantones.json`);
  }

  getDistritosByCanton(provinciaId: number, cantonId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/provincia/${provinciaId}/canton/${cantonId}/distritos.json`);
  }
}