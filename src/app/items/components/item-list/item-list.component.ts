import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ItemsService} from '../../services/items.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {Page} from '../../../shared/models/page';
import {systemIcon} from '../../../shared/variables/variables';
import {PermissionsService} from '../../../core/services/permissions.service';
import {UserAuthService} from '../../../auth/services/user.auth.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  @ViewChild('myTable') table: any;
  public isLoaded = false;
  public firstLoad = true;
  public slider = systemIcon.sliders;
  // public hideEye = systemIcon.hideEye;
  public faInfo = systemIcon.infoIcon;
  public faEdit = systemIcon.editIcon;
  public faDelete = systemIcon.deleteIcon;
  public faPlus = systemIcon.addIcon;
  public faSyncAlt = systemIcon.refreshIcon;
  public faEllipsisH = systemIcon.dropdownIcon;
  public id;
  public deletedItem;
  public rows;
  page = new Page();
  public afterDeletedItems;
  modalRef: BsModalRef;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  perm;

  constructor(private itemsService: ItemsService,
              private modalService: BsModalService,
              private notificationService: NotificationsService,
              public permService: PermissionsService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({offset: 0});
    this.permService.getUserPermissions().subscribe((data) => {
      this.perm = data;
      console.log(this.perm);
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
  }

  setPage(pageInfo) {
    this.isLoaded = false;
    this.firstLoad = true;
    this.page.pageNumber = pageInfo.offset;
    this.sub1 = this.itemsService.getItemsList(pageInfo.offset)
      .subscribe(pagedData => {
        console.log(pagedData);
        this.isLoaded = true;
        this.itemsService.setDataItem(pagedData.items);
        this.rows = pagedData.items;
        this.page.totalElements = pagedData.count;
      }, error2 => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
  }

  updateDataTable(event) {
    const val = event.target.value;
    console.log(val);
      this.itemsService.getItemsList('', val)
        .subscribe((data) => {
          console.log(data);
          this.rows = data.items;
          this.page.totalElements = data.count;
          this.page.pageNumber = 0;
        });
  }

  openModal(template: TemplateRef<any>, id: number, name: string) {
    this.modalRef = this.modalService.show(template);
    this.itemsService.currentItemIdDelete = id;
    this.deletedItem = name;
  }

  onDeleteItem() {
    this.id = this.itemsService.currentItemIdDelete;
    this.sub2 = this.itemsService.deleteItem(this.id)
      .subscribe((data) => {
        if (data.success) {
          if (this.itemsService.getItemsCount() > 1) {
            this.afterDeletedItems = this.rows.value.filter(item => item.id !== this.id);
            this.itemsService.setDataItem(this.afterDeletedItems);
            this.page.totalElements--;
            this.notificationService.notify('warn', '', `Item ${this.deletedItem} has been deleted successfully!`);
          } else if (this.itemsService.getItemsCount() === 1 && this.page.pageNumber !== 0) {
            this.setPage({offset: `${this.page.pageNumber - 1}`});
            this.notificationService.notify('warn', '', `Item ${this.deletedItem} has been deleted successfully!`);
          } else if (this.itemsService.getItemsCount() === 1 && this.page.pageNumber === 0) {
            this.setPage({offset: `${this.page.pageNumber}`});
            this.notificationService.notify('warn', '', `Item ${this.deletedItem} has been deleted successfully!`);
          }
        } else if (data.error) {
          this.notificationService.notify('error', '', `${data.error_description}`);
        }
      }, error1 => {
        this.notificationService.notify('error', '', `Something went wrong please try repeat letter!`);
      });
    this.modalRef.hide();
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  refreshData() {
    this.setPage({offset: this.page.pageNumber});
  }

  showRowDetails() {
    this.firstLoad = false;
    this.table.rowDetail.expandAllRows();
  }

  hideRowDetails() {
    this.firstLoad = true;
    this.table.rowDetail.collapseAllRows();
  }
}
