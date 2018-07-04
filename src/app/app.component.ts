import {Component} from '@angular/core';
import {AuthService} from "./core/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isAuthorized = false;

  constructor(private authService: AuthService) {
    // this.isAuthorized = this.authService.isLoggedIn;
    this.authService.loginEventEmitter.subscribe((authStatus: boolean) => {
      console.log(authStatus);
      this.isAuthorized = authStatus;
    });
  }

  logout() {
    this.authService.logout();
  }
}
