import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AccountManagementService} from '../../../core/services/account.management.service';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-user-dateils',
  templateUrl: './user-dateils.component.html',
  styleUrls: ['./user-dateils.component.scss']
})
export class UserDateilsComponent implements OnInit {
  public user;
  private id;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountManagementService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.accountService.getUserById(this.id)
      .subscribe((data) => {
        if (data) {
          this.user = data.user;
        }
      });
  }

  backToUsers() {
    this.router.navigateByUrl('accounts');
  }

}
