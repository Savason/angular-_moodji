import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ItemsService} from '../../services/items.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NotificationsService} from '../../../shared/services/notifications.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  public faellipsish = faEllipsisH;
  public id;
  public deletedItem;
  public rows: BehaviorSubject<any[]>;
  public afterDeletedItems;
  modalRef: BsModalRef;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();

  constructor(private itemsService: ItemsService,
              private modalService: BsModalService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.sub1 = this.itemsService.getItemsList(1)
      .subscribe((data) => {
        console.log(data);
        this.itemsService.setDataItem(data.items);
        this.rows = this.itemsService.items$;
      });
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
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
        console.log(data);
        if (data.success) {
          if (this.itemsService.getItemsCount() > 1) {
            this.afterDeletedItems = this.rows.value.filter(item => item.id !== this.id);
            this.itemsService.setDataItem(this.afterDeletedItems);
            this.notificationService.notify('warn', '', `Item ${this.deletedItem} has been deleted successfully!`);
          }
        } else if (data.error) {
          console.log(data);
          this.notificationService.notify('error', '', `${data.error_description}`);
        }
      }, error1 => {
        this.notificationService.notify('error', '', `Something went wrong please try repeat letter!`);
      });
    this.modalRef.hide();
  }
}
