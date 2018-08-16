import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {systemIcon} from '../../../../shared/variables/variables';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {RolesManagementService} from '../../../services/roles.management.service';
import {NotificationsService} from '../../../../shared/services/notifications.service';
import {RoleModel} from '../../../../shared/models/role.model';
import {Subscription} from 'rxjs';
import {validateAllFields} from '../../../../shared/validators/validate-all-fields';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit, OnDestroy {
  public editRoleForm: FormGroup;
  private debounceTime: any;
  public errorForm = systemIcon.errorForm;
  private editUserId;
  private currentUser;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();


  constructor(private permissionsService: RolesManagementService,
              private modalService: BsModalService,
              private modalRef: BsModalRef,
              private notificationService: NotificationsService) {
  }

  getErrorNameMessage() {
    return this.editRoleForm.get('name')['errors']['required'] ? 'This field is required' :
      this.editRoleForm.get('name')['errors']['forbiddenName'] ? 'This role name is already taken' : '';
  }

  ngOnInit() {
    console.log(this.editUserId);
    this.sub1 = this.permissionsService.getRoleByKey(this.editUserId)
      .subscribe((data) => {
        if (data !== null) {
          console.log(data);
          this.currentUser = data;
          this.editRoleForm.patchValue({
            'name': this.currentUser.name
          });
        }
      });
    this.editRoleForm = new FormGroup({
      'name': new FormControl('', [Validators.required], this.forbiddenName.bind(this))
    });
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub1.unsubscribe();
    }
    if (this.sub3) {
      this.sub1.unsubscribe();
    }

  }

  editCurrentRole() {
    if (this.editRoleForm.invalid) {
      validateAllFields(this.editRoleForm);
    } else if (this.editRoleForm.valid) {
      const {name} = this.editRoleForm.value;
      const editRole = new RoleModel(name, this.currentUser.roleId);
      console.log(editRole);
      this.sub2 = this.permissionsService.changeUserRole(editRole)
        .subscribe((data) => {
          this.onFormClose();
          if (data.success) {
            this.modalService.setDismissReason('edit_success');
            console.log(data.success);
            this.permissionsService.editedRole = data.success.value;
            this.notificationService.notify('success', '', `Role ${data.success.value.name} has been updated successfully!`);
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
    this.editRoleForm.reset();
  }

  forbiddenName = (control: FormControl): Promise<any> => {
    clearTimeout(this.debounceTime);
    return new Promise((resolve) => {
      this.debounceTime = setTimeout(() => {
        this.sub3 = this.permissionsService.getRoleByKey(control.value)
          .subscribe((data) => {
            console.log(data);
            if (data !== null && data.roleName === this.currentUser.roleName) {
              resolve(null);
            } else if (data !== null) {
              resolve({forbiddenName: true});
            } else {
              resolve(null);
            }
          });
      }, 200);
    });
  };
}
