import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagenotfoundComponent} from './components/pagenotfound/pagenotfound.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {UiSwitchModule} from 'ngx-ui-switch';
import {GrowlModule} from 'primeng/growl';
import { NotificationComponent } from './components/notification/notification.component';
import {SystemLoaderComponent} from './components/loader/system-loader.component';
import {AccordionModule, SplitButtonModule, TooltipModule} from 'primeng/primeng';
import {ModalSmLoaderComponent} from './components/loader/modal-sm-loader.component';
import {ToastModule} from 'primeng/toast';
import {PaginationComponent} from './components/pagination/pagination.component';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgxDatatableModule,
    GrowlModule,
    ToastModule,
    AccordionModule,
    TooltipModule,
    SplitButtonModule
  ],
  exports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    GrowlModule,
    ToastModule,
    NotificationComponent,
    MessagesComponent,
    SystemLoaderComponent,
    ModalSmLoaderComponent,
    AccordionModule,
    TooltipModule,
    SplitButtonModule
  ],
  declarations: [
    PagenotfoundComponent,
    NotificationComponent,
    SystemLoaderComponent,
    ModalSmLoaderComponent,
    PaginationComponent,
    MessagesComponent
  ]
})
export class SharedModule {
}
