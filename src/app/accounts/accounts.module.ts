import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountsComponent} from './accounts.component';
import {AccountsRoutingModule} from './accounts.routing.module';
import {CreateNewUserComponent} from './components/create-new-user/create-new-user.component';
import {SharedModule} from '../shared/shared.module';
import {AccordionModule, BsDropdownModule, ModalModule, PaginationModule} from 'ngx-bootstrap';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {RolesTableComponent} from './components/roles-table/roles-table.component';
import {UserListComponent} from './components/user-list/user-list.component';
import {CreateNewRoleComponent} from './components/roles-table/create-new-role/create-new-role.component';
import {EditRoleComponent} from './components/roles-table/edit-role/edit-role.component';

@NgModule({
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  declarations: [
    AccountsComponent,
    CreateNewUserComponent,
    EditUserComponent,
    RolesTableComponent,
    UserListComponent,
    CreateNewRoleComponent,
    EditRoleComponent
  ],
  entryComponents: [
    EditUserComponent,
    CreateNewUserComponent,
    CreateNewRoleComponent,
    EditRoleComponent
  ]
})
export class AccountsModule { }
