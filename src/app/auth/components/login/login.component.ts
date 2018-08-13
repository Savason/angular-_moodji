import {Component, OnInit} from '@angular/core';
import {faUser, faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserAuthService} from '../../services/user.auth.service';
import {systemIcon} from '../../../shared/variables/variables';
import {NotificationsService} from "../../../shared/services/notifications.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  faUser = faUser;
  faUnlockAlt = faUnlockAlt;
  formError = systemIcon.errorForm;

  getErrorUserNameMessage() {
    return this.form.get('username')['errors']['required'] ? 'This field is required' :
      this.form.get('username')['errors']['noUser'] ? 'There are no user with this name or password' : '';
  }

  getErrorPasswordMessage() {
    return this.form.get('password')['errors']['required'] ? 'This field is required' :
      '';
  }

  constructor(private authUserService: UserAuthService,
              private router: Router,
              private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.form.controls['username'].markAsTouched();
    const formData = this.form.value;
    this.authUserService.login(formData)
      .subscribe(
        data => {
          if (data) {
            this.router.navigate(['']);
          } else {
            this.router.navigate(['login']);
          }
        },
        error => {
          this.notificationsService.notify('error', '', `${error.error.error_description} or user doesn't exist in system`);
        }
      );
  }

}
