import {Component, OnInit} from '@angular/core';
import {faUser, faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserAuthService} from '../../services/user.auth.service';
import {systemIcon} from '../../../shared/variables/variables';

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
      '';
  }

  getErrorPasswordMessage() {
    return this.form.get('password')['errors']['required'] ? 'This field is required' :
      '';
  }

  constructor(private authUserService: UserAuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
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
          console.log(error);
        }
      );
  }

}
