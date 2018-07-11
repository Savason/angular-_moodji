import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountManagementService} from '../../../core/services/account.management.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public form: FormGroup;
  public userRoles;
  public user;
  private id;
  public currentEmail;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountManagementService) {
  }

  getErrorNameMessage() {
    return this.form.get('name')['errors']['required'] ? 'This field is required' : '';
  }

  getErrorEmailMessage() {
    return this.form.get('email')['errors']['required'] ? 'This field is required' :
      this.form.get('email')['errors']['pattern'] ? 'Not a valid email' :
        this.form.get('email')['errors']['forbiddenEmail'] ? 'This email is already taken' : '';
  }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)], this.forbiddenEmails.bind(this)),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.accountService.getUserById(this.id)
      .subscribe((data) => {
        if (data) {
          this.user = data.user;
          this.currentEmail = this.user.email;
          this.form.get('name').setValue(this.user.name);
          this.form.get('email').setValue(this.user.email);
        }
      });
    this.accountService.getUserRole()
      .subscribe((data) => {
        this.userRoles = data;
      });
    console.log(this.form);
  }

  onSubmit() {
    const {name, email} = this.form.value;
    const user = {
      name: name,
      email: email
    };
    this.accountService.changeUser(this.id, user)
      .subscribe((data) => {
        this.router.navigateByUrl('accounts');
      });
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.accountService.getUserByEmail(control.value)
        .subscribe((data) => {
          console.log(this.currentEmail);
          console.log(data);
          if (data !== null && data.email === this.currentEmail) {
            // resolve({forbiddenEmail: false});
            resolve(null);
          } else if (data !== null) {
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    });
  }

  backToUsers() {
    this.router.navigateByUrl('accounts');
  }
}
