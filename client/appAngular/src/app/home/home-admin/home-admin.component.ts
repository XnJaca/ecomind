import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent {
  currentUser: any;
  //Get month name
  mesActual = new Date().toLocaleString('default', { month: 'long' });
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
