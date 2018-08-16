import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoleModel} from '../../../../shared/models/role.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {RolesManagementService} from '../../../services/roles.management.service';
import {NotificationsService} from '../../../../shared/services/notifications.service';
import {systemIcon} from '../../../../shared/variables/variables';
import {Subscription} from 'rxjs';
import {validateAllFields} from '../../../../shared/validators/validate-all-fields';

@Component({
  selector: 'app-create-new-role',
  templateUrl: './create-new-role.component.html',
  styleUrls: ['./create-new-role.component.scss']
})
export class CreateNewRoleComponent implements OnInit, OnDestroy {
  public newRoleForm: FormGroup;
  private debounceTime: any;
  public errorForm = systemIcon.errorForm;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();


  constructor(private permissionsService: RolesManagementService,
              private modalService: BsModalService,
              private modalRef: BsModalRef,
              private notificationService: NotificationsService) {
  }

  getErrorNameMessage() {
    return this.newRoleForm.get('name')['errors']['required'] ? 'This field is required' :
      this.newRoleForm.get('name')['errors']['forbiddenName'] ? 'This role name is already taken' : '';
  }

  ngOnInit() {
    this.newRoleForm = new FormGroup({
      'name': new FormControl('', [Validators.required], this.forbiddenName.bind(this))
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

  createNewRole() {
    if (this.newRoleForm.invalid) {
      validateAllFields(this.newRoleForm);
    } else if (this.newRoleForm.valid) {
      const {name} = this.newRoleForm.value;
      const role = new RoleModel(name);
      console.log(role);
      this.sub1 = this.permissionsService.createUserRole(role)
        .subscribe((data) => {
          this.onFormClose();
          if (data.success) {
            this.sub2 = this.permissionsService.getPermissionTable()
              .subscribe((data1) => {
                console.log(data1);
                this.permissionsService.newPermissionsList = data1.rms;
              });
            const newRole = data.value;
            console.log(newRole);
            this.modalService.setDismissReason('create_success');
            this.notificationService.notify('success', '', `Role ${role.name} has been created successfully!`);
          } else if (data.error) {
            this.notificationService.notify('error', '', `${data.error}`);
          }
        }, error1 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    }
  }

  onFormClose() {
    this.modalRef.hide();
    this.newRoleForm.reset();
  }

  forbiddenName = (control: FormControl): Promise<any> => {
    clearTimeout(this.debounceTime);
    return new Promise((resolve) => {
      this.debounceTime = setTimeout(() => {
        this.sub3 = this.permissionsService.getRoleByKey(control.value)
          .subscribe((data) => {
            console.log(data);
            if (data !== null) {
              resolve({forbiddenName: true});
            } else {
              resolve(null);
            }
          });
      }, 200);
    });
  };
}
