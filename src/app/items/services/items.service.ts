import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class ItemsService extends BaseApi {
  public items = [];
  public items$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.items);
  public currentItemIdDelete;

  constructor(public http: HttpClient) {
    super(http);
  }

  getItemsList(page): Observable<any> {
    return this.get(`api/item?page=${page}`);
  }

  createNewItem(data): Observable<any> {
    return this.post(`api/item`, data);
  }

  updateItem(id: number): Observable<any> {
    return this.put(`api/item/${id}`);
  }

  deleteItem(id: number): Observable<any> {
    return this.delete(`api/item/${id}`);
  }

  setDataItem(item) {
    return this.items$.next(item);
  }
  getItemsCount() {
    return this.items$.getValue().length;
  }
}
