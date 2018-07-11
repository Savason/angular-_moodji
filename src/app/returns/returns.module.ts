import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReturnsComponent} from './returns.component';
import {ReturnsRoutingModule} from './returns.routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReturnsRoutingModule,
    SharedModule,
  ],
  declarations: [
    ReturnsComponent
  ]
  , providers: [
  ]

})
export class ReturnsModule {
}
