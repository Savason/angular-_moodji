import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ItemsComponent} from './items.component';
import {CreateNewItemsComponent} from './components/create-new-items/create-new-items.component';
import {ItemEditComponent} from './components/item-edit/item-edit.component';
import {ItemDetailsComponent} from './components/item-details/item-details.component';

const routes: Routes = [
  {
    path: '', component: ItemsComponent
  },
  {
    path: 'new_item', component: CreateNewItemsComponent
  },
  {
    path: 'edit/:id', component: ItemEditComponent
  },
  {
    path: ':id', component: ItemDetailsComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemsRoutingModule {
}
