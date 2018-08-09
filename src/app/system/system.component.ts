import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserAuthService} from '../auth/services/user.auth.service';
import {systemIcon} from '../shared/variables/variables';
import {PermissionsService} from '../core/services/permissions.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit, OnDestroy {
  public isAuthorized = false;
  public setVisibility = false;
  public itemIcon = systemIcon.itemIcon;
  public lofOutIcon = systemIcon.logOutIcon;
  public userIcon = systemIcon.userIcon;
  public rmsIcon = systemIcon.rmsIcon;
  perm;
  sub1 = new Subscription();

  constructor(private authUserService: UserAuthService,
              private permService: PermissionsService) {
  }

  checkPermission(perm) {
    if (this.perm.includes(perm)) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.authUserService.loginEventEmitter.subscribe((authStatus: boolean) => {
      console.log(authStatus);
      this.isAuthorized = authStatus;
    });
    this.checkEnteredUserExistingLocalStorage();
    this.sub1 = this.permService.getUserPermissions()
      .subscribe((data) => {
        this.perm = data;
      });
  }

  ngOnDestroy() {
    if (this.sub1) {
      console.log(1);
      this.sub1.unsubscribe();
    }
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
