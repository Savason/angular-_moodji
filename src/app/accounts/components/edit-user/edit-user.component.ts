import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {AccountManagementService} from '../../services/account.management.service';
import {systemIcon} from '../../../shared/variables/variables';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public form: FormGroup;
  public faExclamationCircle = systemIcon.errorForm;
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
    return this.form.get('name')['errors']['required'] ? 'This field is required' :
      this.form.get('name')['errors']['forbiddenName'] ? 'This username is already taken' : '';
  }

  ngOnInit() {
    this.sub1 = this.accountService.getUserRole()
      .subscribe((data) => {
        this.userRoles = data;
      });
    this.sub4 = this.accountService.getUserByKey(this.editUserId)
      .subscribe((data) => {
        setTimeout(() => {
          this.isLoaded = true;
        }, 200);
        this.currentEditUser = data;
        this.form.patchValue({
          'name': this.currentEditUser.username,
          'roleId': this.currentEditUser.role_id
        });
      });
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required], this.forbiddenName.bind(this)),
      'roleId': new FormControl(''),
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
    const {name, roleId} = this.form.value;
    const user = {
      name: name,
      roleId: roleId
    };
    console.log(user);
    this.sub2 = this.accountService.changeUser(this.currentEditUser.id, user)
      .subscribe((data) => {
          if (data.success) {
            this.modalService.setDismissReason('edit_success');
            this.accountService.currentEditedUser = data.value;
          } else if (data.error) {
            this.notificationService.notify('warn', '', `${data.error}`);
          }
        },
        error2 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    this.bsModalRef.hide();
  }

  forbiddenName(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.sub3 = this.accountService.getUserByKey(control.value)
        .subscribe((data) => {
          if (data !== null && data.username === this.currentEditUser.username) {
            resolve(null);
          } else if (data !== null) {
            resolve({forbiddenName: true});
          } else {
            resolve(null);
          }
        });
    });
  }
}
