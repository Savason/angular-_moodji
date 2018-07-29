import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemsComponent} from './items.component';
import {ItemsRoutingModule} from './items.routing.module';
import {CreateNewItemsComponent} from './components/create-new-items/create-new-items.component';
import {ItemListComponent} from './components/item-list/item-list.component';
import {SharedModule} from '../shared/shared.module';
import {NumberFormatDirective} from './directives/number-formar.directive';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {ItemDetailsComponent} from './components/item-details/item-details.component';
import {ItemEditComponent} from './components/item-edit/item-edit.component';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ItemsRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    ItemsComponent,
    CreateNewItemsComponent,
    ItemListComponent,
    ItemDetailsComponent,
    ItemEditComponent,
    NumberFormatDirective
  ]
})
export class ItemsModule { }
