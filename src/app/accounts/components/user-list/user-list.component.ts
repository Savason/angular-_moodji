import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {UserFilterService} from '../../services/user.filter.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public rows;
  public usersRoles = [];
  public faEdit = systemIcon.editIcon;
  public faDelete = systemIcon.deleteIcon;
  public faPlus = systemIcon.addIcon;
  public clearIcon = systemIcon.clearIcon;
  public faEllipsisH = systemIcon.dropdownIcon;
  public filterIcon = systemIcon.filterIcon;
  public showMoreIcon = systemIcon.showMoreIcon;
  public cancelIcon = systemIcon.cancelIcon;
  public id: number;
  public deletedUser;
  public statusChangedUser;
  page = new Page();
  modalRef: BsModalRef;
  perm;
  showPagination;
  filterChipsStatus = '';
  filterChipsRole = '';
  filterChipsSearch = '';
  filterRoleVal = null;
  filterStatusVal = null;
  isRoleFiltered = false;
  isStatusFiltered = false;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();
  sub5 = new Subscription();
  sub6 = new Subscription();
  sub7 = new Subscription();
  sub8 = new Subscription();
  sub9 = new Subscription();


  constructor(public accountService: AccountManagementService,
              private modalService: BsModalService,
              private notificationService: NotificationsService,
              private filterService: UserFilterService,
              private permService: PermissionsService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  checkPermission(perm) {
    return this.perm.find(p => p === perm);
  }

  ngOnInit() {
    this.setPage(0);
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
    this.filterService.clearAllSearchParams();
  }

  setPage(pageInfo) {
    this.isLoaded = false;
    this.page.pageNumber = pageInfo;
    console.log(this.page.pageNumber);
    this.sub1 = this.accountService.getAllUsers(pageInfo)
      .subscribe(pagedData => {
        console.log(pagedData);
        this.accountService.setDataUser(pagedData.users);
        this.rows = this.accountService.Users$;
        this.accountService.totalUserCount = pagedData.users_count;
        this.page.pageNumber = pagedData.page;
        this.showPagination = Math.ceil(this.accountService.totalUserCount / 10);
        console.log(this.showPagination);
        // this.page.totalPages = this.accountService.totalUserCount;
        this.accountService.getUserRoleWithoutPerm()
          .subscribe((data) => {
            this.isLoaded = true;
            this.usersRoles = data;
            console.log(this.usersRoles);
          });
      }, error => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
  }

  updateTablePagination() {
    this.sub6 = this.filterService.addSearchParams('page', this.page.pageNumber + 1)
      .subscribe((data) => {
        console.log(data);
        this.page.pageNumber = data.page;
        console.log(this.page.pageNumber);
        console.log(this.showPagination);
        this.onShowMoreDisplay(data.users_count);
        this.accountService.addToUserList(data.users);
      });
  }

  contextDataTableSearch(event) {
    this.filterService.clearSearchParams('page');
    this.page.pageNumber = 0;
    const val = event.target.value;
    this.filterChipsSearch = event.target.value;
    this.sub7 = this.filterService.addSearchParams('search', val)
      .subscribe((data) => {
        console.log(data);
        this.accountService.setDataUser(data.users);
        this.onShowMoreDisplay(data.users_count);
      });
  }

  filterByKey(key: string, term: string, description?: string) {
    this.page.pageNumber = 0;
    this.filterService.clearSearchParams('page');
    this.sub8 = this.filterService.addSearchParams(key, term)
      .subscribe((data) => {
        if (key === 'role') {
          this.filterChipsRole = term;
          this.isRoleFiltered = true;
        } else {
          this.filterChipsStatus = description;
          this.isStatusFiltered = true;
        }
        this.accountService.setDataUser(data.users);
        this.onShowMoreDisplay(data.users_count);
      });
  }

  clearFilter(key) {
    this.page.pageNumber = 0;
    this.filterService.clearSearchParams('page');
    if (key === 'search') {
      this.filterChipsSearch = '';
    } else if (key === 'role') {
      this.filterChipsRole = '';
      this.filterRoleVal = null;
      this.isRoleFiltered = false;
    } else if (key === 'status') {
      this.filterChipsStatus = '';
      this.filterStatusVal = null;
      this.isStatusFiltered = false;
    }
    this.sub9 = this.filterService.removeSearchParams(key)
      .subscribe((data) => {
        console.log(data);
        this.onShowMoreDisplay(data.users_count);
        this.accountService.setDataUser(data.users);
      });
  }

  onShowMoreDisplay(users_count) {
    this.accountService.totalUserCount = users_count;
    return this.showPagination = Math.ceil(this.accountService.totalUserCount / 10);
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
        this.notificationService.notify('success', '', `User ${this.accountService.currentEditedUser.username} has been edited successfully!`);
      }
    });
  }

  createNewUserModal() {
    this.modalRef = this.modalService.show(CreateNewUserComponent, Object.assign({}, {class: 'modal-lg'}));
  }

}
