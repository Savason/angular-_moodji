import {Component} from '@angular/core';
import {UserAuthService} from '../auth/services/user.auth.service';
import {systemIcon} from '../shared/variables/variables';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent {
  public isAuthorized = false;
  public setVisibility = false;
  public itemIcon = systemIcon.itemIcon;
  public lofOutIcon = systemIcon.logOutIcon;
  public userIcon = systemIcon.userIcon;
  public rmsIcon = systemIcon.rmsIcon;

  constructor(private authUserService: UserAuthService) {
    this.authUserService.loginEventEmitter.subscribe((authStatus: boolean) => {
      console.log(authStatus);
      this.isAuthorized = authStatus;
    });
    this.checkEnteredUserExistingLocalStorage();
  }

  onSetVisibility() {
    this.setVisibility = true;
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
