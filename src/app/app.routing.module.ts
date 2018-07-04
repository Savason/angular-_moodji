import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './core/components/home/home.component';
import {AuthGuard} from './core/guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'orders', loadChildren: '../app/orders/orders.module#OrdersModule', canActivate: [AuthGuard]},
  {path: 'returns', loadChildren: '../app/returns/returns.module#ReturnsModule', canActivate: [AuthGuard]},
  {path: 'login', loadChildren: '../app/auth/auth.module#AuthModule'}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
