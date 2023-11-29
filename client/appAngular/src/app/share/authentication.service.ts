import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { CartService } from "./cart.service";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    ServerUrl = environment.apiURL;

    private tokenUserSubject: BehaviorSubject<any>;

    public currentUser: Observable<any>;

    private authenticated = new BehaviorSubject<boolean>(false);

    private user = new BehaviorSubject<any>(null);


    constructor(private http: HttpClient, private cartService: CartService, private router: Router) {

        this.tokenUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('tokenUser')));

        this.currentUser = this.tokenUserSubject.asObservable();
    }

    public get tokenUserValue(): any {
        return this.tokenUserSubject.value;
    }

    get isAuthenticated() {
        if (this.tokenUserValue != null) {
            this.authenticated.next(true);
        } else {
            this.authenticated.next(false);
        }

        return this.authenticated.asObservable();
    }

    createUser(user: any): Observable<any> {
        return this.http.post<any>(
            this.ServerUrl + 'user/registrar',
            user
        );
    }

    get decodeToken(): any {
        this.user.next(null);
        if (this.tokenUserValue != null) {
            this.user.next(jwtDecode(this.tokenUserValue))
        }

        return this.user.asObservable();
    }

    loginUser(user: any): Observable<any> {
        return this.http
            .post<any>(this.ServerUrl + 'usuario/login', user)
            .pipe(
                map((response) => {
                    // almacene los detalles del usuario y el token jwt
                    // en el almacenamiento local para mantener al usuario conectado entre las actualizaciones de la página

                    localStorage.setItem('currentUser', JSON.stringify(response.token));
                    this.authenticated.next(true);
                    this.tokenUserSubject.next(response.token);
                    let userData = this.decodeToken;
                    console.log("USER DATA", userData);
                    
                    return userData;
                })
            );
    }
    //Logout de usuario autentificado
    logout() {
        let usuario = this.tokenUserSubject.value;
        if (usuario) {
            // eliminar usuario del almacenamiento local para cerrar la sesión del usuario
            localStorage.removeItem('currentUser');
            //Eliminarlo del observable del usuario actual
            this.tokenUserSubject.next(null);
            //Eliminarlo del observable del boleano si esta autenticado
            this.authenticated.next(false);
            //Eliminar carrito
            this.cartService.deleteCart();
            return true;
        }
        return false;
    }

}