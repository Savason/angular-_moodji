import {Component} from '@angular/core';
import {UserAuthService} from './auth/services/user.auth.service';
import {Message} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isAuthorized = false;
  msgs: Message[] = [];

  constructor(private authUserService: UserAuthService) {
    this.authUserService.loginEventEmitter.subscribe((authStatus: boolean) => {
      console.log(authStatus);
      this.isAuthorized = authStatus;
    });
    this.checkEnteredUserExistingLocalStorage();
  }

  private checkEnteredUserExistingLocalStorage() {

    if (JSON.parse(localStorage.getItem('access_token'))) {
      this.isAuthorized = true;
    }
  }

  logout() {
    this.authUserService.logout();
    this.isAuthorized = false;
  }
}
