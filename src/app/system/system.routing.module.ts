import {NgModule} from '@angular/core';
import {HomeComponent} from '../core/components/home/home.component';
import {AuthGuard} from '../core/guards/auth.guard';
import {RouterModule, Routes} from '@angular/router';
import {SystemComponent} from './system.component';
import {PagenotfoundComponent} from '../shared/components/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: '', component: SystemComponent, children: [
      {path: '', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'accounts', loadChildren: '../../app/accounts/accounts.module#AccountsModule', canActivate: [AuthGuard]},
      {path: 'activities', loadChildren: '../../app/activities/activities.module#ActivitiesModule', canActivate: [AuthGuard]},
      {path: 'inbounds', loadChildren: '../../app/system/inbound/inbound.module#InboundModule', canActivate: [AuthGuard]},
      {path: 'items', loadChildren: '../../app/items/items.module#ItemsModule', canActivate: [AuthGuard]},
      {path: '**', component: PagenotfoundComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class SystemRoutingModule {
}
