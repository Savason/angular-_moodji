import {Component, OnDestroy, OnInit} from '@angular/core';
import {faUser, faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserAuthService} from '../../services/user.auth.service';
import {systemIcon} from '../../../shared/variables/variables';
import {validateAllFields} from '../../../shared/validators/validate-all-fields';
import {Message, MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  msgs: Message[] = [];
  public form: FormGroup;
  faUser = faUser;
  faUnlockAlt = faUnlockAlt;
  formError = systemIcon.errorForm;
  invalidUser = false;
  forbiddenUser = {
    access: false,
    text: ''
  };
  sub1 = new Subscription();
  sub2 = new Subscription();

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
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
    this.sub2 = this.form.valueChanges
      .subscribe((data) => {
        if (data) {
          this.invalidUser = false;
          this.forbiddenUser = {
            access: false,
            text: ''
          };
        }
      });
  }

  ngOnDestroy() {
    this.invalidUser = false;
    this.forbiddenUser = {
      access: false,
      text: ''
    };
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      validateAllFields(this.form);
    } else if (this.form.valid) {
      const formData = this.form.value;
      this.sub1 = this.authUserService.login(formData)
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
            if (error.error.error === 'invalid_grant') {
              this.invalidUser = true;
            } else if (error.status === 403) {
              this.forbiddenUser = {
                access: true,
                text: error.error.error.exception[0].message
              };
            }
          }
        );
    }
  }
}
