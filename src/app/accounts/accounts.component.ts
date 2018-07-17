import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AccountManagementService} from './services/account.management.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Page} from '../shared/models/page';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import {CreateNewUserComponent} from './components/create-new-user/create-new-user.component';
import {NotificationsService} from '../shared/services/notifications.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  public faInfo = faInfoCircle;
  public faEdit = faEdit;
  public faDelete = faTrashAlt;
  public addUser = faUserPlus;
  public id: number;
  public deletedUser;
  public statusChangedUser;
  public currentDeletedUser;
  page = new Page();
  rows: BehaviorSubject<any[]>;
  modalRef: BsModalRef;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();

  constructor(public accountService: AccountManagementService,
              private modalService: BsModalService,
              private notificationService: NotificationsService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({offset: 0});
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

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.sub1 = this.accountService.getAllUsers(pageInfo.offset)
      .subscribe(pagedData => {
        console.log(pagedData);
        this.accountService.setDataUser(pagedData.users);
        this.rows = this.accountService.Users$;
        this.accountService.totalUserCount = pagedData.users_count;
        this.page.totalPages = this.accountService.totalUserCount;
        this.page.pageNumber = pagedData.page;
      }, error2 => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
  }

  onChangeStatus(status: boolean, id: string | number) {
    if (status === true) {
      this.sub2 = this.accountService.deactivateUser(id)
        .subscribe((data) => {
          if (data.success) {
            this.statusChangedUser = this.rows.value.find(user => user.id === id);
            this.statusChangedUser.enabled = data.value.enabled;
            this.notificationService.notify('warn', '', `User ${data.value.email} has been disabled successfully!`);
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
            this.notificationService.notify('success', '', `User ${data.value.email} has been activated successfully!`);
          } else if (data.error) {
            this.notificationService.notify('warn', '', `${data.error}`);
          }
        }, error2 => {
          this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
        });
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template);
    this.accountService.currentUserIdDelete = id;
  }

  onDeleteUser() {
    this.id = this.accountService.currentUserIdDelete;
    this.sub4 = this.accountService.deleteCurrentUser(this.id)
      .subscribe((data) => {
        if (data.success) {
          if (this.accountService.getUserCount() > 1) {
            this.deletedUser = this.rows.value.find(user => user.id === this.id);
            this.currentDeletedUser = this.rows.value.filter(user => user.id !== this.id);
            this.accountService.setDataUser(this.currentDeletedUser);
            this.accountService.totalUserCount--;
            console.log(this.page.pageNumber);
            console.log(this.deletedUser);
            this.notificationService.notify('warn', '', `User ${this.deletedUser.email} has been deleted successfully!`);
          } else if (this.page.pageNumber !== 0) {
            this.setPage({offset: `${this.page.pageNumber - 1}`});
          }
        } else if (data.error) {
          this.notificationService.notify('warn', '', `${data.error}`);
        }
      }, error2 => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
    this.modalRef.hide();
  }

  editCurrentUserModal(currentUser) {
    const initialState = {
      currentEditUser: currentUser,
    };
    this.modalRef = this.modalService.show(EditUserComponent, Object.assign({initialState}, {class: 'modal-lg'}));
    this.modalService.onHide.subscribe((data) => {
      console.log(data);
      if (data === 'edit_success') {
        this.setPage({offset: `${this.page.pageNumber}`});
      }
    });
  }

  createNewUserModal() {
    this.modalRef = this.modalService.show(CreateNewUserComponent, Object.assign({}, {class: 'modal-lg'}));
  }

}

