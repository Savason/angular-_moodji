import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountsComponent} from './accounts.component';
import {AccountsRoutingModule} from './accounts.routing.module';
import {CreateNewUserComponent} from './components/create-new-user/create-new-user.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule
  ],
  declarations: [
    AccountsComponent,
    CreateNewUserComponent
  ]
})
export class AccountsModule { }
