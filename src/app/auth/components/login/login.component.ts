import {Component, OnInit} from '@angular/core';
import {faUser, faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  faUser = faUser;
  faUnlockAlt = faUnlockAlt;

  getErrorUserNameMessage() {
    return this.form.get('userName')['errors']['required'] ? 'This field is required' :
      '';
  }

  getErrorPasswordMessage() {
    return this.form.get('userPassword')['errors']['required'] ? 'This field is required' :
      '';
  }

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'userName': new FormControl('', [Validators.required]),
      'userPassword': new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    // const formData = this.form.value;
    this.authService.login();
  }

}
