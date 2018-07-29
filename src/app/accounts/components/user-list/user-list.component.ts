import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AccountManagementService} from '../../services/account.management.service';
import {CreateNewUserComponent} from '../create-new-user/create-new-user.component';
import {Page} from '../../../shared/models/page';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {EditUserComponent} from '../edit-user/edit-user.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons/faEllipsisH';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public faInfo = faInfoCircle;
  public faEdit = faEdit;
  public faDelete = faTrashAlt;
  public faPlus = faPlus;
  public faSyncAlt = faSyncAlt;
  public faEllipsisH = faEllipsisH;
  public id: number;
  public deletedUser;
  public statusChangedUser;
  public currentDeletedUser;
  page = new Page();
  rows: BehaviorSubject<any>;
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
    this.isLoaded = false;
    this.page.pageNumber = pageInfo.offset;
    this.sub1 = this.accountService.getAllUsers(pageInfo.offset)
      .subscribe(pagedData => {
        this.isLoaded = true;
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
            console.log(data);
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

  openModal(template: TemplateRef<any>, id: number, email: string) {
    this.modalRef = this.modalService.show(template);
    this.accountService.currentUserIdDelete = id;
    this.deletedUser = email;
  }

  onDeleteUser() {
    this.id = this.accountService.currentUserIdDelete;
    this.sub4 = this.accountService.deleteCurrentUser(this.id)
      .subscribe((data) => {
        if (data.success) {
          if (this.accountService.getUserCount() > 1) {
            this.currentDeletedUser = this.rows.value.filter(user => user.id !== this.id);
            this.accountService.setDataUser(this.currentDeletedUser);
            this.accountService.totalUserCount--;
            console.log(this.page.pageNumber);
            console.log(this.deletedUser);
            this.notificationService.notify('warn', '', `User ${this.deletedUser} has been deleted successfully!`);
          } else if (this.accountService.getUserCount() === 1 && this.page.pageNumber !== 0) {
            console.log(this.deletedUser);
            this.setPage({offset: `${this.page.pageNumber - 1}`});
            this.notificationService.notify('warn', '', `User ${this.deletedUser} has been deleted successfully!`);
          }
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
    this.modalService.onHide.subscribe((data) => {
      if (data === 'edit_success') {
        this.setPage({offset: `${this.page.pageNumber}`});
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
