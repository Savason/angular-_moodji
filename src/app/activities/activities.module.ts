import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivitiesComponent} from './activities.component';
import {ActivitiesRoutingModule} from './activities.routing.module';
import {SharedModule} from '../shared/shared.module';
import {AccordionModule, BsDropdownModule, ModalModule, PaginationModule} from 'ngx-bootstrap';
import {ActivitiesListComponent} from './components/activities-list/activities-list.component';

@NgModule({
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    SharedModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  declarations: [
    ActivitiesComponent,
    ActivitiesListComponent,
  ],
  entryComponents: []
})
export class ActivitiesModule { }
