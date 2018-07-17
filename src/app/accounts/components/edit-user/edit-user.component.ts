import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {AccountManagementService} from '../../services/account.management.service';
import {regExps} from '../../../shared/variables/variables';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public userRoles;
  public currentEditUser;
  private userList;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();

  constructor(private accountService: AccountManagementService,
              public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private notificationService: NotificationsService) {
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
    console.log(this.currentEditUser);
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(regExps.emailPattern)], this.forbiddenEmails.bind(this)),
      'role_id': new FormControl(''),
    });
    this.form.get('name').setValue(this.currentEditUser.name);
    this.form.get('email').setValue(this.currentEditUser.email);
    this.form.get('role_id').setValue(this.currentEditUser.role_id);
    this.sub1 = this.accountService.getUserRole()
      .subscribe((data) => {
        this.userRoles = data;
      });
    this.userList = this.accountService.getUsers();
    console.log(this.userList);
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
  }

  onSubmit() {
    const {name, email, role_id} = this.form.value;
    const user = {
      name: name,
      email: email,
      role_id: role_id
    };
    console.log(user);
    this.sub2 = this.accountService.changeUser(this.currentEditUser.id, user)
      .subscribe((data) => {
          if (data.success) {
            this.modalService.setDismissReason('edit_success');
            this.notificationService.notify('success', '', `User ${data.value.email} has been edited successfully!`);
          } else if (data.error) {
            this.notificationService.notify('warn', '', `${data.error}`);
          }
        },
        error2 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    this.bsModalRef.hide();
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.sub3 = this.accountService.getUserByEmail(control.value)
        .subscribe((data) => {
          console.log(control.value);
          if (data !== null && data.email === this.currentEditUser.email) {
            resolve(null);
          } else if (data !== null) {
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    });
  }
}
