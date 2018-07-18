import {Component} from '@angular/core';
import {Message} from 'primeng/api';
import {UserAuthService} from '../auth/services/user.auth.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent {
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
