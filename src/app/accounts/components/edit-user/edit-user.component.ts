import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {AccountManagementService} from '../../services/account.management.service';
import {regExps} from '../../../shared/variables/variables';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public faExclamationCircle = faExclamationTriangle;
  public form: FormGroup;
  public userRoles;
  private editUserId;
  private currentEditUser;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();

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
    this.sub1 = this.accountService.getUserRole()
      .subscribe((data) => {
        this.userRoles = data;
      });
    this.sub4 = this.accountService.getUserById(this.editUserId)
      .subscribe((data) => {
        setTimeout(() => {
          this.isLoaded = true;
        }, 300);
        this.currentEditUser = data.user;
        console.log(this.currentEditUser);
        this.form.patchValue({
          'name': this.currentEditUser.name,
          'email': this.currentEditUser.email,
          'role_id': this.currentEditUser.role_id
        });
      });
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(regExps.emailPattern)], this.forbiddenEmails.bind(this)),
      'role_id': new FormControl(''),
    });
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
    if (this.sub4) {
      this.sub4.unsubscribe();
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
            console.log(data);
            // this.accountService.currentEditedUser = data.value;
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
