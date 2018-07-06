import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from './accounts.component';
import {CreateNewUserComponent} from './components/create-new-user/create-new-user.component';

const routes: Routes = [
  {
    path: '', component: AccountsComponent, children: [
      {path: 'create', component: CreateNewUserComponent}
    ]
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
