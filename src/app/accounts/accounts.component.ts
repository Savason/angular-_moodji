import {Component, OnInit, TemplateRef} from '@angular/core';
import {AccountManagementService} from '../core/services/account.management.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Message} from 'primeng/components/common/api';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  modalRef: BsModalRef;
  public faInfo = faInfoCircle;
  public faEdit = faEdit;
  public faDelete = faTrashAlt;
  public users: BehaviorSubject<any[]>;
  public id: number;
  public deletedUser;
  public statusChangedUser;
  public currentDeletedUser;
  public msgs: Message[] = [];

  constructor(private accountService: AccountManagementService,
              private modalService: BsModalService) {
  }


  ngOnInit() {
    this.accountService.getAllUsers()
      .subscribe((data) => {
        console.log(data);
        this.accountService.setDataUser(data.users);
      });
    this.users = this.accountService.getUsers();
    console.log(this.users);
  }


  onChangeStatus(status: boolean, id: string | number) {
    if (status === true) {
      this.accountService.deactivateUser(id)
        .subscribe((data) => {
          console.log(data);
          this.statusChangedUser = this.users.value.find(user => user.id === id);
          this.statusChangedUser.enabled = data.value.enabled;
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: '', detail: `User ${data.value.email} has been disabled successfully`});
        });
    } else {
      this.accountService.activateUser(id)
        .subscribe((data) => {
          console.log(data);
          this.statusChangedUser = this.users.value.find(workspace => workspace.id === id);
          this.statusChangedUser.enabled = data.value.enabled;
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: '', detail: `User ${data.value.email} has been activated successfully`});
        });
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template);
    this.accountService.currentUserIdDelete = id;
  }

  onDeleteUser() {
    this.id = this.accountService.currentUserIdDelete;
    this.accountService.deleteCurrentUser(this.id)
      .subscribe((data) => {
        if (data.success) {
          this.deletedUser = this.users.value.find(user => user.id === this.id);
          this.currentDeletedUser = this.users.value.filter(user => user.id !== this.id);
          this.accountService.setDataUser(this.currentDeletedUser);
          console.log(this.deletedUser);
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: '', detail: `User ${this.deletedUser.email} has been deleted successfully!`});
        }
      });
    this.modalRef.hide();
  }
}

