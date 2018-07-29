import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SystemComponent} from './system.component';
import {SystemRoutingModule} from './system.routing.module';
import {Message} from 'primeng/api';
import {UserAuthService} from '../auth/services/user.auth.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
  ],
  declarations: [SystemComponent]
})
export class SystemModule {

}
