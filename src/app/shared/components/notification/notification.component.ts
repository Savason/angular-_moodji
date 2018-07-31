import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../../services/notifications.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [MessageService]
})
export class NotificationComponent implements OnInit, OnDestroy {
  // msgs: Message[] = [];
  subscription: Subscription;

  constructor(private notificationsService: NotificationsService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.subscribeToNotifications();
  }

  // subscribeToNotifications() {
  //   this.subscription = this.notificationsService.notificationChange
  //     .subscribe(notification => {
  //       this.msgs = [];
  //       this.msgs.push(notification);
  //     });
  // }
  subscribeToNotifications() {
    this.subscription = this.notificationsService.notificationChange
      .subscribe(notification => {
        this.messageService.add(notification);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
