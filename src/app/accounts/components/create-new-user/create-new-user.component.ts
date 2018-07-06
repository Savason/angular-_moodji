import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {matchOtherValidator} from '../../../shared/validators/confirm-password';
import {User} from '../../../shared/models/user.model';
import {AccountManagementService} from '../../../core/services/account.management.service';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit {
  public form: FormGroup;
  public userRoles;

  getErrorNameMessage() {
    return this.form.get('name')['errors']['required'] ? 'This field is required' : '';
  }

  getErrorEmailMessage() {
    return this.form.get('email')['errors']['required'] ? 'This field is required' :
      this.form.get('email')['errors']['pattern'] ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage() {
    return this.form.get('password')['errors']['required'] ? 'This field is required' :
      this.form.get('password')['errors']['minlength'] ? 'Please enter at least 6 characters' :
        '';
  }

  getErrorConfirmPasswordMessage() {
    return this.form.get('confirmPassword')['errors']['required'] ? 'This field is required' :
      this.form.get('confirmPassword')['errors']['minlength'] ? 'Please enter at least 6 characters' :
        this.form.get('confirmPassword')['errors']['matchOther'] ? 'Passwords do not match' : '';
  }

  constructor(public accountService: AccountManagementService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)], this.forbiddenEmails.bind(this)),
      'role_id': new FormControl('243', [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6), matchOtherValidator('password')]),
    });
    this.accountService.getUserRole()
      .subscribe((data) => {
        this.userRoles = data;
      });
    console.log(this.userRoles);
  }

  onSubmit() {
    console.log(this.form);
    const {email, role_id, password, name} = this.form.value;
    const user = new User(email, role_id, password, name);
    console.log(user);
    this.accountService.createNewUser(user)
      .subscribe((data) => {
        console.log(data);
      });
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.accountService.getUserByEmail(control.value)
        .subscribe((data) => {
          console.log(data);
          if (data === true) {
            console.log(resolve);
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    });
  }
}

