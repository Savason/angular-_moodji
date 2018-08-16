import {Component, OnInit} from '@angular/core';
import {AccountManagementService} from '../../../accounts/services/account.management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private accountService: AccountManagementService) {
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('username'));
    console.log(user);
    this.accountService.getUserByKey(user)
      .subscribe((data) => {
      });
  }

}
