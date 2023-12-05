import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent {
  currentUser: any;

  constructor(
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.authService.decodeToken.subscribe((user: any) => (
      this.currentUser = user
    ))
  }
}
