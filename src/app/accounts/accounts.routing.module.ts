import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from './accounts.component';
import {UserDateilsComponent} from './components/user-dateils/user-dateils.component';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {RolesTableComponent} from './components/roles-table/roles-table.component';

const routes: Routes = [
  {
    path: '', component: AccountsComponent
  },
  {
    path: 'role_table', component: RolesTableComponent
  },
  {
    path: ':id', component: UserDateilsComponent
  },
  {
    path: 'edit/:id', component: EditUserComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountsRoutingModule {
}
