import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Message} from 'primeng/api';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  msgs: Message[] = [];
  subscription: Subscription;
  dd;

  constructor(private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscription = this.notificationsService.notificationChange
      .subscribe(notification => {
        this.msgs.length = 0;
        this.msgs.push(notification);
      });
    //  setInterval(() => {
    //   console.log('1');
    //   this.msgs.length = 0;
    // }, 5000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
