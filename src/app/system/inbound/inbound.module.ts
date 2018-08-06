import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InboundRoutingModule} from './inbound.routing.module';
import {InboundComponent} from './inbound.component';
import {InboundListComponent} from './components/inbound-list/inbound-list.component';

@NgModule({
  imports: [
    CommonModule,
    InboundRoutingModule
  ],
  declarations: [
    InboundComponent,
    InboundListComponent
  ]
})
export class InboundModule { }
