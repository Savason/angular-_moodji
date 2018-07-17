import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemsComponent} from './items.component';
import {ItemsRoutingModule} from './items.routing.module';
import {CreateNewItemsComponent} from './components/create-new-items/create-new-items.component';
import {ItemListComponent} from './components/item-list/item-list.component';
import {SharedModule} from '../shared/shared.module';
import {NumberFormatDirective} from './directives/number-formar.directive';

@NgModule({
  imports: [
    CommonModule,
    ItemsRoutingModule,
    SharedModule
  ],
  declarations: [
    ItemsComponent,
    CreateNewItemsComponent,
    ItemListComponent,
    NumberFormatDirective
  ]
})
export class ItemsModule { }
