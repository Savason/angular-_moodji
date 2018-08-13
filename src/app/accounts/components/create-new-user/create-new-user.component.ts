import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../shared/models/user.model';
import {AccountManagementService} from '../../services/account.management.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {BehaviorSubject, Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {systemIcon} from '../../../shared/variables/variables';
import {matchOtherValidator} from '../../../shared/validators/confirm-password';


@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit, OnDestroy {
  public userRoles: BehaviorSubject<any>;
  public form: FormGroup;
  public faeye = systemIcon.showIcon;
  public faeyeslash = systemIcon.hideIcon;
  public faExclamationCircle = systemIcon.errorForm;
  public hide = true;
  public totalUserCount: number;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();

  constructor(public accountService: AccountManagementService,
              private modalService: BsModalService,
              private modalRef: BsModalRef,
              private notificationsService: NotificationsService) {
  }

  getErrorNameMessage() {
    return this.form.get('name')['errors']['required'] ? 'This field is required' :
      this.form.get('name')['errors']['forbiddenName'] ? 'This username is already taken' : '';
  }

  getErrorTypeMessage() {
    return this.form.get('roleId')['errors']['required'] ? 'This field is required' : '';
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


  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required], this.forbiddenName.bind(this)),
      'roleId': new FormControl(null, [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6), matchOtherValidator('password')]),
    });
    this.sub1 = this.accountService.getUserRole()
      .subscribe((data) => {
        this.accountService.setDataUserRoles(data);
        this.userRoles = this.accountService.getUserRoles();
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
  }

  onSubmit() {
    console.log(this.accountService.totalUserCount);
    const {roleId, password, name} = this.form.value;
    const user = new User(roleId, password, name);
    this.sub2 = this.accountService.createNewUser(user)
      .subscribe((data) => {
          this.modalRef.hide();
          if (data.success) {
            this.accountService.addToUserList(data.value);
            this.accountService.totalUserCount++;
            this.notificationsService.notify('success', '', `User ${name} has been created successfully!`);
            this.form.reset();
          } else if (data.error) {
            this.notificationsService.notify('warn', '', `${data.error}`);
          }
        },
        error2 => {
          this.notificationsService.notify('error', '', `Something went wrong please try repeat letter!`);
        });
  }

  onFormClose() {
    this.modalRef.hide();
    this.form.reset();
  }

  forbiddenName(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.sub3 = this.accountService.getUserByKey(control.value)
        .subscribe((data) => {
          if (data !== null) {
            resolve({forbiddenName: true});
          } else {
            resolve(null);
          }
        });
    });
  }
}

