import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ItemsComponent} from './items.component';
import {CreateNewItemsComponent} from './components/create-new-items/create-new-items.component';

const routes: Routes = [
  {
    path: '', component: ItemsComponent, children: []
  },
  {
    path: 'new_item', component: CreateNewItemsComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemsRoutingModule {
}
