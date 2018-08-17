import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ActivitiesService} from '../../services/activities.service';
import {Page} from '../../../shared/models/page';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {Subscription} from 'rxjs';
import {PermissionsService} from '../../../core/services/permissions.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {systemIcon} from '../../../shared/variables/variables';
import {ActivitiesFilterService} from '../../services/activities.filter.service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss'],
})
export class ActivitiesListComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public rows;
  public clearIcon = systemIcon.clearIcon;
  public faEllipsisH = systemIcon.dropdownIcon;
  public filterIcon = systemIcon.filterIcon;
  public showMoreIcon = systemIcon.showMoreIcon;
  public cancelIcon = systemIcon.cancelIcon;
  public id: number;
  page = new Page();
  perm;
  showPagination;
  filterChipsSearch = '';
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();
  sub5 = new Subscription();
  sub6 = new Subscription();
  sub7 = new Subscription();
  sub8 = new Subscription();
  sub9 = new Subscription();


  constructor(public activitiesService: ActivitiesService,
              private notificationService: NotificationsService,
              private filterService: ActivitiesFilterService,
              private permService: PermissionsService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  checkPermission(perm) {
    return this.perm.find(p => p === perm);
  }

  ngOnInit() {
    this.setPage(0);
    this.permService.getUserPermissions().subscribe((data) => {
      this.perm = data;
      console.log(this.perm);
    });
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
    if (this.sub5) {
      this.sub5.unsubscribe();
    }
    if (this.sub6) {
      this.sub6.unsubscribe();
    }
    if (this.sub7) {
      this.sub7.unsubscribe();
    }
    if (this.sub8) {
      this.sub8.unsubscribe();
    }
    if (this.sub9) {
      this.sub9.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.isLoaded = false;
    this.page.pageNumber = pageInfo;
    console.log(this.page.pageNumber);
    this.sub1 = this.activitiesService.getAllActivities(pageInfo)
      .subscribe(pagedData => {
        console.log(pagedData);
        this.activitiesService.setDataActivity(pagedData.activities);
        this.rows = this.activitiesService.Activities$;
        console.log(this.rows);
        this.activitiesService.totalActivitiesCount = pagedData.activities_count;
        this.page.pageNumber = pagedData.page;
        this.showPagination = Math.ceil(this.activitiesService.totalActivitiesCount / 10);
        console.log(this.showPagination);
        this.page.totalPages = this.activitiesService.totalActivitiesCount;
        this.isLoaded = true;
      }, error => {
        this.notificationService.notify('error', '', `Something went wrong, please try again letter!`);
      });
  }

  updateTablePagination() {
    this.sub6 = this.filterService.addSearchParams('page', this.page.pageNumber + 1)
      .subscribe((data) => {
        console.log(data);
        this.page.pageNumber = data.page;
        console.log(this.page.pageNumber);
        console.log(this.showPagination);
        this.onShowMoreDisplay(data.activities_count);
        this.activitiesService.addToActivitiesList(data.activities);
      });
  }

  contextDataTableSearch(event) {
    this.filterService.clearSearchParams('page');
    this.page.pageNumber = 0;
    const val = event.target.value;
    this.filterChipsSearch = event.target.value;
    this.sub7 = this.filterService.addSearchParams('search', val)
      .subscribe((data) => {
        console.log(data);
        this.activitiesService.setDataActivity(data.activities);
        this.onShowMoreDisplay(data.activities_count);
      });
  }

  clearFilter(key) {
    this.page.pageNumber = 0;
    this.filterService.clearSearchParams('page');
    if (key === 'search') {
      this.filterChipsSearch = '';
    }
    this.sub9 = this.filterService.removeSearchParams(key)
      .subscribe((data) => {
        console.log(data);
        this.onShowMoreDisplay(data.activities_count);
        this.activitiesService.setDataActivity(data.activities);
      });
  }

  onShowMoreDisplay(activity_count) {
    this.activitiesService.totalActivitiesCount = activity_count;
    return this.showPagination = Math.ceil(this.activitiesService.totalActivitiesCount / 10);
  }

}
