import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../shared/models/user.model';
import {AccountManagementService} from '../../services/account.management.service';
import {matchOtherValidator} from '../../../shared/validators/confirm-password';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {BehaviorSubject, Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {regExps} from '../../../shared/variables/variables';
import {faEye} from '@fortawesome/free-solid-svg-icons/faEye';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit, OnDestroy {
  public faeye = faEye;
  public faeyeslash = faEyeSlash;
  public hide = true;
  public form: FormGroup;
  public userRoles: BehaviorSubject<any>;
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
    return this.form.get('name')['errors']['required'] ? 'This field is required' : '';
  }

  getErrorEmailMessage() {
    return this.form.get('email')['errors']['required'] ? 'This field is required' :
      this.form.get('email')['errors']['pattern'] ? 'Not a valid email' :
        this.form.get('email')['errors']['forbiddenEmail'] ? 'This email is already taken' : '';
  }

  getErrorTypeMessage() {
    return this.form.get('role_id')['errors']['required'] ? 'This field is required' : '';
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
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(regExps.emailPattern)], this.forbiddenEmails.bind(this)),
      'role_id': new FormControl(null, [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6), matchOtherValidator('password')]),
    });
    this.sub1 = this.accountService.getUserRole()
      .subscribe((data) => {
        console.log(data);
        this.accountService.setDataUserRoles(data);
        this.userRoles = this.accountService.getUserRoles();
        console.log(this.userRoles);
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
    const {email, role_id, password, name} = this.form.value;
    const user = new User(email, role_id, password, name);
    this.sub2 = this.accountService.createNewUser(user)
      .subscribe((data) => {
          console.log(data);
          if (data.success) {
            this.accountService.addToUserList(data.value);
            this.accountService.totalUserCount++;
            this.notificationsService.notify('success', '', `User ${email} has been created successfully!`);
            this.form.reset();
          } else if (data.error) {
            this.notificationsService.notify('warn', '', `${data.error}`);
          }
        },
        error2 => {
          this.notificationsService.notify('error', '', `Something went wrong please try repeat letter!`);
        });
    this.modalRef.hide();
  }

  onFormClose() {
    this.modalRef.hide();
    this.form.reset();
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.sub3 = this.accountService.getUserByEmail(control.value)
        .subscribe((data) => {
          if (data !== null) {
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    });
  }
}

