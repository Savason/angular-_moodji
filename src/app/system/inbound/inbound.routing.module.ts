import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InboundComponent} from './inbound.component';

const inboundRoute: Routes = [
  {path: '', component: InboundComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(inboundRoute)
  ],
  exports: [
    RouterModule
  ]
})
export class InboundRoutingModule {
}
