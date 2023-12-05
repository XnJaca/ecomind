import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { UserModule } from './user/user.module';
import { VideojuegoModule } from './videojuego/videojuego.module';
import { OrdenModule } from './orden/orden.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MaterialreciclableModule } from './materialreciclable/materialreciclable.module';
import { CentroacopioModule } from './centroacopio/centroacopio.module';
import { CanjeMaterialModule } from './canjematerial/canjematerial.module';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { CanjecuponModule } from './canjecupon/canjecupon.module';
import { MatNativeDateModule } from '@angular/material/core';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    CoreModule,
    ShareModule,
    HomeModule,
    UserModule,
    CanjecuponModule,
    VideojuegoModule,
    MaterialreciclableModule,
    CentroacopioModule,
    CanjeMaterialModule,
    OrdenModule,
    AppRoutingModule,
    MatNativeDateModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
