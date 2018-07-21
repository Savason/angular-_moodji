import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ItemsService} from '../../services/items.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {Page} from '../../../shared/models/page';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public faInfo = faInfoCircle;
  public faEdit = faEdit;
  public faDelete = faTrashAlt;
  public faPlus = faPlus;
  public faSyncAlt = faSyncAlt;
  public id;
  public deletedItem;
  public rows: BehaviorSubject<any[]>;
  page = new Page();
  public afterDeletedItems;
  modalRef: BsModalRef;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();

  constructor(private itemsService: ItemsService,
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
  }

  setPage(pageInfo) {
    this.isLoaded = false;
    this.page.pageNumber = pageInfo.offset;
    this.sub1 = this.itemsService.getItemsList(pageInfo.offset)
      .subscribe(pagedData => {
        console.log(pagedData);
        this.isLoaded = true;
        this.itemsService.setDataItem(pagedData.items);
        this.rows = this.itemsService.items$;
        this.page.totalElements = pagedData.count;
      }, error2 => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
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

  refreshData() {
    this.setPage({offset: this.page.pageNumber});
  }

}
