import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagenotfoundComponent} from './components/pagenotfound/pagenotfound.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {UiSwitchModule} from 'ngx-ui-switch';
import {GrowlModule} from 'primeng/growl';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    GrowlModule
  ],
  declarations: [PagenotfoundComponent]
})
export class SharedModule {
}
