import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { NotificacionService, TipoMessage } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthenticationService, private noti: NotificacionService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Verifica la URL de la solicitud
    if (request.url.includes('https://ubicaciones.paginasweb.cr/')) {
      // Si la URL contiene la cadena, no manejes errores
      return next.handle(request);
    }


    let token = null;

    if (this.auth.tokenUserValue != null) {
      token = this.auth.tokenUserValue;
    }

    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });


    // Para otras URLs, aplica el manejo de errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message: string = null;
        if (error.error) {
          console.log(error.error.error);
          
          message = error.error.error;
          this.noti.mensaje('Error', `${message}`, TipoMessage.error);

          // Arrojar el error nuevamente para que se maneje en otros lugares si es necesario
          return throwError(error);
        }
        switch (error.status) {
          case 400:
            message = 'Solicitud incorrecta';
            break;
          case 401:
            message = 'No autorizado';
            break;
          case 403:
            message = 'Acceso denegado';
            break;
          case 422:
            message = 'Se ha presentado un error';
            break;
        }

        this.noti.mensaje('Error', `${error.status} ${message}`, TipoMessage.error);

        // Arrojar el error nuevamente para que se maneje en otros lugares si es necesario
        return throwError(error);
      })
    );
  }
}
