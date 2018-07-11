import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {UserAuthService} from './services/user.auth.service';
import {AccountManagementService} from './services/account.management.service';
import {JwtInterceptor} from './helpers/jwt.interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RolesManagementService} from './services/roles.management.service';

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
    AccountManagementService,
    RolesManagementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
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
