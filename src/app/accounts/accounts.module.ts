import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountsComponent} from './accounts.component';
import {AccountsRoutingModule} from './accounts.routing.module';
import {CreateNewUserComponent} from './components/create-new-user/create-new-user.component';
import {SharedModule} from '../shared/shared.module';
import {AccordionModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {UserDateilsComponent} from './components/user-dateils/user-dateils.component';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {RolesTableComponent} from './components/roles-table/roles-table.component';

@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  declarations: [
    AccountsComponent,
    CreateNewUserComponent,
    UserDateilsComponent,
    EditUserComponent,
    RolesTableComponent,
  ],
  entryComponents: [
    EditUserComponent,
    CreateNewUserComponent
  ]
})
export class AccountsModule { }
