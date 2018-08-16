import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from 'primeng/api';
import {Subscription} from 'rxjs';
import {MessagesService} from '../../services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  msgs: Message[] = [];
  subscription: Subscription;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit() {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscription = this.messagesService.notificationChange
      .subscribe(notification => {
        this.msgs = [];
        this.msgs.push(notification);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
