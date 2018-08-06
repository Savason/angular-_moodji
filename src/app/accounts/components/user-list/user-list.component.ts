import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AccountManagementService} from '../../services/account.management.service';
import {CreateNewUserComponent} from '../create-new-user/create-new-user.component';
import {Page} from '../../../shared/models/page';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {EditUserComponent} from '../edit-user/edit-user.component';
import {Subscription} from 'rxjs';
import {PermissionsService} from '../../../core/services/permissions.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {systemIcon} from '../../../shared/variables/variables';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public rows;
  public faEdit = systemIcon.editIcon;
  public faDelete = systemIcon.deleteIcon;
  public faPlus = systemIcon.addIcon;
  public faSyncAlt = systemIcon.refreshIcon;
  public faEllipsisH = systemIcon.dropdownIcon;
  public id: number;
  public deletedUser;
  public statusChangedUser;
  page = new Page();
  modalRef: BsModalRef;
  perm;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();
  sub5 = new Subscription();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ll = false;

  constructor(public accountService: AccountManagementService,
              private modalService: BsModalService,
              private notificationService: NotificationsService,
              private permService: PermissionsService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  checkPermission(perm) {
    return this.perm.find(p => p === perm);
  }

  ngOnInit() {
    this.setPage({offset: 0});
    this.permService.getUserPermissions().subscribe((data) => {
      this.perm = data;
      console.log(this.perm);
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
  }

  setPage(pageInfo) {
    this.isLoaded = false;
    this.page.pageNumber = pageInfo.offset;
    this.sub1 = this.accountService.getAllUsers(pageInfo.offset)
      .subscribe(pagedData => {
        this.isLoaded = true;
        this.accountService.setDataUser(pagedData.users);
        this.rows = this.accountService.Users$;
        this.accountService.totalUserCount = pagedData.users_count;
        this.page.totalPages = this.accountService.totalUserCount;
        // this.page.pageNumber = pagedData.page;
      }, error2 => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
  }

  updateDataTable(event) {
    const val = event.target.value;
    this.accountService.getAllUsers('', val)
      .subscribe((data) => {
        console.log(data);
        this.accountService.setDataUser(data.users);
        this.accountService.totalUserCount = data.users_count;
        this.page.totalPages = this.accountService.totalUserCount;
        this.table.offset = 0;
      });
  }

  onChangeStatus(status: boolean, id: string | number) {
    if (status === true) {
      this.sub2 = this.accountService.deactivateUser(id)
        .subscribe((data) => {
          if (data.success) {
            this.statusChangedUser = this.rows.value.find(user => user.id === id);
            this.statusChangedUser.enabled = data.value.enabled;
            this.notificationService.notify('warn', '', `User ${data.value.username} has been disabled successfully!`);
          } else if (data.error) {
            this.notificationService.notify('warn', '', `${data.error}`);
          }
        }, error2 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    } else {
      this.sub3 = this.accountService.activateUser(id)
        .subscribe((data) => {
          if (data.success) {
            this.statusChangedUser = this.rows.value.find(user => user.id === id);
            this.statusChangedUser.enabled = data.value.enabled;
            this.notificationService.notify('success', '', `User ${data.value.username} has been activated successfully!`);
          } else if (data.error) {
            this.notificationService.notify('warn', '', `${data.error}`);
          }
        }, error2 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    }
  }

  openModal(template: TemplateRef<any>, id: number, username: string) {
    this.modalRef = this.modalService.show(template);
    this.accountService.currentUserIdDelete = id;
    this.deletedUser = username;
  }

  onDeleteUser() {
    this.id = this.accountService.currentUserIdDelete;
    this.sub4 = this.accountService.deleteCurrentUser(this.id)
      .subscribe((data) => {
        if (data.success) {
          if (this.accountService.getUserCount() > 1) {
            const deletedUser = this.accountService.Users$.getValue().filter(user => user.id !== this.id);
            this.accountService.setDataUser(deletedUser);
            this.accountService.totalUserCount--;
          } else if (this.accountService.getUserCount() === 1 && this.page.pageNumber !== 0) {
            console.log(this.deletedUser);
            this.setPage({offset: `${this.page.pageNumber - 1}`});
          }
          this.notificationService.notify('warn', '', `User ${this.deletedUser} has been deleted successfully!`);
        } else if (data.error) {
          this.notificationService.notify('warn', '', `${data.error}`);
        }
      }, error2 => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
    this.modalRef.hide();
  }

  editCurrentUserModal(id: number) {
    const initialState = {
      editUserId: id,
    };
    this.modalRef = this.modalService.show(EditUserComponent, Object.assign({initialState}, {class: 'modal-lg'}));
    this.sub5 = this.modalService.onHide.subscribe((data) => {
      this.sub5.unsubscribe();
      if (data === 'edit_success') {
        const idx = this.rows.value.findIndex(user => user.id === this.accountService.currentEditedUser.id);
        this.rows.value[idx] = this.accountService.currentEditedUser;
        this.accountService.setDataUser([...this.rows.value]);
        this.notificationService.notify('success', '', `User ${this.accountService.currentEditedUser.username} has been edited successfully!`);
      }
    });
  }

  createNewUserModal() {
    this.modalRef = this.modalService.show(CreateNewUserComponent, Object.assign({}, {class: 'modal-lg'}));
  }

  refreshData() {
    this.setPage({offset: this.page.pageNumber});
  }
}
