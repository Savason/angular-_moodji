import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {RolesManagementService} from '../../services/roles.management.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {systemIcon} from '../../../shared/variables/variables';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {Subscription} from 'rxjs';
import {CreateNewRoleComponent} from './create-new-role/create-new-role.component';
import {EditRoleComponent} from './edit-role/edit-role.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PermissionsService} from '../../../core/services/permissions.service';
import {validateAllFields} from '../../../shared/validators/validate-all-fields';
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  public isLoaded = false;
  public isProcessing = false;
  public form: FormGroup;
  public addIcon = systemIcon.addIcon;
  public deleteIcon = systemIcon.cancelIcon;
  public editIcon = systemIcon.editIcon;
  public errorForm = systemIcon.errorForm;
  public permissionTable;
  public deletedRole;
  public admin;
  private hasUsers;
  public redefinedRoles;
  public usersRolesForDelete;
  modalRef: BsModalRef;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();
  sub5 = new Subscription();
  sub6 = new Subscription();
  sub7 = new Subscription();
  sub8 = new Subscription();
  sub9 = new Subscription();
  sub10 = new Subscription();
  sub11 = new Subscription();
  sub12 = new Subscription();
  idx: number;
  perm;

  constructor(private permissionsService: RolesManagementService,
              private modalService: BsModalService,
              private notificationService: NotificationsService,
              private permService: PermissionsService,
              private element: ElementRef) {
  }

  getErrorTypeMessage() {
    return this.form.get('role_id')['errors']['required'] ? 'This field is required' : '';
  }

  ngAfterViewInit() {
    this.sub1 = this.permissionsService.getPermissionTable()
      .subscribe((data) => {
        this.isLoaded = true;
        console.log(data);
        this.permissionsService.permissionList = data.rms;
        this.permissionTable = this.permissionsService.permissionList;
        this.admin = this.permissionTable.roles.find(role => role.name === 'ADMIN');
        this.idx = 0;
      });
  }


  ngOnInit() {
    this.permService.getUserPermissions().subscribe((data) => {
      this.perm = data;
      console.log(this.perm);
    });
    this.form = new FormGroup({
      'role_id': new FormControl(null, [Validators.required]),
    });
  }

  checkPermission(perm) {
    return this.perm.find(p => p === perm);
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
    if (this.sub5) {
      this.sub5.unsubscribe();
    }
    if (this.sub6) {
      this.sub6.unsubscribe();
    }
    if (this.sub7) {
      this.sub7.unsubscribe();
    }
    if (this.sub8) {
      this.sub8.unsubscribe();
    }
    if (this.sub9) {
      this.sub9.unsubscribe();
    }
    if (this.sub10) {
      this.sub10.unsubscribe();
    }
    if (this.sub11) {
      this.sub11.unsubscribe();
    }
    if (this.sub12) {
      this.sub12.unsubscribe();
    }
  }

  createRoleModal() {
    this.modalRef = this.modalService.show(CreateNewRoleComponent, Object.assign({}, {class: 'modal-md'}));
    this.sub2 = this.modalService.onHide.subscribe((data) => {
      console.log(data);
      this.sub2.unsubscribe();
      if (data === 'create_success') {
        this.permissionTable = this.permissionsService.newPermissionsList;
      }
    });
  }

  onEditRole(role) {
    const initialState = {
      editUserId: role.roleId,
      editUserName: role.name,
    };
    console.log(initialState);
    this.modalRef = this.modalService.show(EditRoleComponent, Object.assign({initialState}, {class: 'modal-md'}));
    this.sub3 = this.modalService.onHide.subscribe((data) => {
      this.sub3.unsubscribe();
      console.log(data);
      if (data === 'edit_success') {
        const idx = this.permissionTable.roles.findIndex(r => r.roleId === this.permissionsService.editedRole.roleId);
        this.permissionTable.roles[idx] = this.permissionsService.editedRole;
      }
    });
  }

  onPermissionChange(perm, option, per) {
    this.isProcessing = true;
    console.log(per);
    const parentGroupName = per.name;
    // console.log(option.roleId);
    const blockPermissions = [];
    const isMainPermission = perm.main;
    console.log(isMainPermission);
    per.permissions.forEach((element) => {
      blockPermissions.push({
        permission_id: element.id,
        role_id: element.options.find(el => el.roleId === option.roleId).roleId
      });
      // console.log(blockPermissions);
    });
    const permissionData = {
      permission_id: perm.id,
      role_id: option.roleId,
    };
    if (option.hasAccess === true) {
      if (isMainPermission === true) {
        const observableRequest = [];
        blockPermissions.forEach((element) => {
          observableRequest.push(this.permissionsService.deletePermissionToRole(element));
        });
        this.sub9 = forkJoin(...observableRequest).subscribe((data) => {
          console.log(data);
          if (data[0].success) {
            const roleTableAfter = this.permissionTable.parents.find(p => p.name === parentGroupName).permissions;
            roleTableAfter.forEach((element) => {
              const idx = element.options.findIndex(p => p.roleId === option.roleId);
              element.options[idx] = {roleId: option.roleId, hasAccess: false};
            });
            console.log(data);
            this.isProcessing = false;
            this.notificationService.notify('warn', '', `Permissions ${perm.name} has been removed successfully!`);
          }
        });
      } else if (isMainPermission === false) {
        this.sub4 = this.permissionsService.deletePermissionToRole(permissionData)
          .subscribe((data) => {
            if (data.success) {
              console.log(data);
              option.hasAccess = false;
              this.isProcessing = false;
              this.notificationService.notify('warn', '', `Permissions ${perm.name} has been removed successfully!`);
            } else if (data.error) {
              this.notificationService.notify('error', '', `${data.error}`);
            }
          }, error1 => {
            this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
          });
      }
    } else {
      if (isMainPermission === true) {
        const observableRequest = [];
        blockPermissions.forEach((element) => {
          observableRequest.push(this.permissionsService.addPermissionToRole(element));
        });
        this.sub10 = forkJoin(...observableRequest).subscribe((data) => {
          console.log(data);
          if (data[0].success) {
            const roleTableAfter = this.permissionTable.parents.find(p => p.name === parentGroupName).permissions;
            roleTableAfter.forEach((element) => {
              const idx = element.options.findIndex(p => p.roleId === option.roleId);
              element.options[idx] = {roleId: option.roleId, hasAccess: true};
            });
            this.isProcessing = false;
            this.notificationService.notify('success', '', `Permissions ${perm.name} has been added successfully!`);
          }
          // console.log(roleTableAfter);
        });
      } else if (isMainPermission === false) {
        const isMainHasAccess = this.permissionTable.parents
          .find(p => p.name === parentGroupName).permissions
          .find(p => p.main === true).options
          .find(p => p.roleId === option.roleId).hasAccess;
        console.log(isMainHasAccess);
        // console.log(parentGroupName);
        const parentCheck = {
          permission_id: per.permissions.find(p => p.main === true).id,
          role_id: per.permissions.find(p => p.main === true).options.find(p => p.roleId === option.roleId).roleId
        };
        console.log(parentCheck);
        // console.log(per.permissions.find(p => p.main === true).options.find(p => p.roleId === option.roleId).roleId);
        this.sub4 = this.permissionsService.addPermissionToRole(permissionData)
          .subscribe((data) => {
            if (data.success) {
              console.log(data);
              option.hasAccess = true;
              this.isProcessing = false;
              if (isMainHasAccess === false) {
                this.isProcessing = true;
                this.sub11 = this.permissionsService.addPermissionToRole(parentCheck)
                  .subscribe((dataChild) => {
                    console.log(dataChild);
                    this.permissionTable.parents
                      .find(p => p.name === parentGroupName).permissions
                      .find(p => p.main === true).options
                      .find(p => p.roleId === option.roleId).hasAccess = true;
                    this.isProcessing = false;
                    // per.permissions.find(p => p.main === true).options.find(p => p.roleId === option.roleId).hasAccess = true;
                  });
              }
              this.notificationService.notify('success', '', `Permissions ${perm.name} has been added successfully!`);
            } else if (data.error) {
              this.notificationService.notify('error', '', `${data.error}`);
            }
          }, error1 => {
            this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
          });
      }
    }
  }

  confirmDeleteRole(template: TemplateRef<any>, role) {
    this.modalRef = this.modalService.show(template);
    this.deletedRole = role;
    this.sub8 = this.permissionsService.getUsersByRoleId(role.roleId)
      .subscribe((data) => {
        this.hasUsers = data;
      });
  }

  deleteRole(id, template: TemplateRef<any>) {
    this.modalRef.hide();
    if (this.hasUsers === true) {
      console.log(true);
      console.log(this.deletedRole.roleId);
      this.sub7 = this.permissionsService.getUsersRoles()
        .subscribe((data) => {
          console.log(data);
          this.usersRolesForDelete = data;
          this.redefinedRoles = this.usersRolesForDelete.filter(r => r.id !== this.deletedRole.roleId);
          console.log(this.redefinedRoles);
          this.modalRef = this.modalService.show(template);
        });
    } else {
      console.log(id);
      this.sub6 = this.permissionsService.deleteUserRole(id)
        .subscribe((data) => {
          this.modalRef.hide();
          if (data.success) {
            console.log(data);
            const afterRoleDeleted = this.permissionTable.roles.filter(role => role.roleId !== this.deletedRole.roleId);
            this.permissionTable.roles = afterRoleDeleted;
            const deletedPermission = this.element.nativeElement.getElementsByClassName(this.deletedRole.roleId);
            for (let i = deletedPermission.length - 1; i >= 0; --i) {
              deletedPermission[i].remove();
            }
            this.notificationService.notify('warn', '', `Role ${this.deletedRole.name} has been deleted successfully!`);
          } else if (data.error) {
            this.notificationService.notify('error', '', `${data.error}`);
          }
        }, error1 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    }
  }

  onRedefinedRoles() {
    if (this.form.invalid) {
      validateAllFields(this.form);
    } else if (this.form.valid) {
      const {role_id} = this.form.value;
      console.log(role_id);
      this.sub12 = this.permissionsService.deleteUserRole(this.deletedRole.roleId, role_id)
        .subscribe((data) => {
          if (data.success) {
            console.log(data);
            this.onFormClose();
            const afterRoleDeleted = this.permissionTable.roles.filter(role => role.roleId !== this.deletedRole.roleId);
            this.permissionTable.roles = afterRoleDeleted;
            const deletedPermission = this.element.nativeElement.getElementsByClassName(this.deletedRole.roleId);
            for (let i = deletedPermission.length - 1; i >= 0; --i) {
              deletedPermission[i].remove();
            }
            this.notificationService.notify('warn', '', `Role ${this.deletedRole.name} has been deleted successfully!`);
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
    this.form.reset();
  }

  onTabOpen(event) {
    this.idx = event.index;
  }
}
