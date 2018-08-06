import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from './accounts.component';
import {RolesTableComponent} from './components/roles-table/roles-table.component';
import {AuthGuard} from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: AccountsComponent
  },
  {
    path: 'role_table', component: RolesTableComponent
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
