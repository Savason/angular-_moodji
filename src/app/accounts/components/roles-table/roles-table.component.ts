import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {RolesManagementService} from '../../services/roles.management.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {systemIcon} from '../../../shared/variables/variables';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {Subscription} from 'rxjs';
import {CreateNewRoleComponent} from './create-new-role/create-new-role.component';
import {EditRoleComponent} from './edit-role/edit-role.component';


@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesTableComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public addIcon = systemIcon.addIcon;
  public deleteIcon = systemIcon.cancelIcon;
  public editIcon = systemIcon.editIcon;
  public permissionTable;
  public deletedRole;
  public admin;
  modalRef: BsModalRef;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();
  sub5 = new Subscription();
  sub6 = new Subscription();

  constructor(private permissionsService: RolesManagementService,
              private modalService: BsModalService,
              private notificationService: NotificationsService,
              private element: ElementRef) {
  }

  ngOnInit() {
    this.sub1 = this.permissionsService.getPermissionTable()
      .subscribe((data) => {
        this.isLoaded = true;
        console.log(data);
        this.permissionsService.permissionList = data.rms;
        this.permissionTable = this.permissionsService.permissionList;
        this.admin = this.permissionTable.roles.find(role => role.name === 'ADMIN');
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
    if (this.sub5) {
      this.sub5.unsubscribe();
    }
    if (this.sub6) {
      this.sub6.unsubscribe();
    }
  }

  createRoleModal() {
    this.modalRef = this.modalService.show(CreateNewRoleComponent, Object.assign({}, {class: 'modal-lg'}));
    this.sub2 = this.modalService.onHide.subscribe((data) => {
      // console.log(data);
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
    this.modalRef = this.modalService.show(EditRoleComponent, Object.assign({initialState}, {class: 'modal-lg'}));
    this.sub3 = this.modalService.onHide.subscribe((data) => {
      console.log(data);
      if (data === 'edit_success') {
        console.log(this.permissionsService.editedRole);
        const idx = this.permissionTable.roles.findIndex(r => r.roleId === this.permissionsService.editedRole.roleId);
        console.log(idx);
        this.permissionTable.roles[idx] = this.permissionsService.editedRole;
        console.log(this.permissionTable.roles);
      }
    });
  }

  onPermissionChange(perm, option) {
    const permissionData = {
      permission_id: perm.id,
      role_id: option.roleId,
    };
    console.log(perm);
    if (option.hasAccess === true) {
      this.sub4 = this.permissionsService.deletePermissionToRole(permissionData)
        .subscribe((data) => {
          if (data.success) {
            console.log(data);
            option.hasAccess = false;
            this.notificationService.notify('success', '', `Permissions ${perm.name} has been removed successfully!`);
          } else if (data.error) {
            this.notificationService.notify('error', '', `${data.error}`);
          }
        }, error1 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    } else {
      this.sub5 = this.permissionsService.addPermissionToRole(permissionData)
        .subscribe((data) => {
          if (data.success) {
            console.log(data);
            option.hasAccess = true;
            this.notificationService.notify('success', '', `Permissions ${perm.name} has been added successfully!`);
          } else if (data.error) {
            this.notificationService.notify('error', '', `${data.error}`);
          }
        }, error1 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    }
  }

  confirmDeleteRole(template: TemplateRef<any>, role) {
    this.modalRef = this.modalService.show(template);
    this.deletedRole = role;
    console.log(role);
  }

  deleteRole(id) {
    console.log(id);
    this.sub6 = this.permissionsService.deleteUserRole(id)
      .subscribe((data) => {
        this.modalRef.hide();
        if (data.success) {
          console.log(data);
          const afterRoleDeleted = this.permissionTable.roles.filter(role => role.roleId !== id);
          this.permissionTable.roles = afterRoleDeleted;
          const deletedPermission = this.element.nativeElement.getElementsByClassName(id);
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
