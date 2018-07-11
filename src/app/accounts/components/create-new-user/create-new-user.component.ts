import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../shared/models/user.model';
import {AccountManagementService} from '../../../core/services/account.management.service';
import {matchOtherValidator} from '../../../shared/validators/confirm-password';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import {Message} from 'primeng/components/common/api';


@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit {
  public form: FormGroup;
  public modalRef: BsModalRef;
  public addUser = faUserPlus;
  public userRoles;
  public msgs: Message[] = [];


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

  constructor(public accountService: AccountManagementService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)], this.forbiddenEmails.bind(this)),
      'role_id': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6), matchOtherValidator('password')]),
    });
    this.accountService.getUserRole()
      .subscribe((data) => {
        this.userRoles = data;
      });
  }

  onSubmit() {
    const {email, role_id, password, name} = this.form.value;
    const user = new User(email, role_id, password, name);
    this.accountService.createNewUser(user)
      .subscribe((data) => {
        this.accountService.addToUserList(data.value);
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: '', detail: `User ${email} has been created successfully!`});
        this.form.reset();
      });
    this.modalRef.hide();
  }

  onFormClose() {
    this.modalRef.hide();
    this.form.reset();
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.accountService.getUserByEmail(control.value)
        .subscribe((data) => {
          if (data !== null) {
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}

