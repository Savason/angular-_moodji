import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {JwtInterceptor} from './helpers/jwt.interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {UserAuthService} from '../auth/services/user.auth.service';
import {AccountManagementService} from '../accounts/services/account.management.service';
import {RolesManagementService} from '../accounts/services/roles.management.service';
import {ItemsService} from '../items/services/items.service';
import {NotificationsService} from '../shared/services/notifications.service';
import {PermissionsService} from './services/permissions.service';
import {InboundsService} from '../system/inbound/services/inbounds.service';
import {UserFilterService} from '../accounts/services/user.filter.service';
import {MessageService} from 'primeng/api';
import {ActivitiesService} from '../activities/services/activities.service';
import {ActivitiesFilterService} from '../activities/services/activities.filter.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [
    AuthGuard,
    UserAuthService,
    PermissionsService,
    AccountManagementService,
    ActivitiesService,
    ActivitiesFilterService,
    UserFilterService,
    RolesManagementService,
    ItemsService,
    NotificationsService,
    MessageService,
    InboundsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
