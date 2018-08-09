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

  getItemsList(page, search?: string): Observable<any> {
    if (search !== undefined) {
      return this.get(`api/item?search=${search}`);
    } else {
      return this.get(`api/item?page=${page}`);
    }
  }

  createNewItem(data): Observable<any> {
    return this.post(`api/item`, data);
  }

  updateItem(id: number, data): Observable<any> {
    return this.post(`api/item/${id}`, data);
  }

  deleteItem(id: number): Observable<any> {
    return this.delete(`api/item/${id}`);
  }

  getItemByEan(ean: string): Observable<any> {
    return this.get(`api/item/${ean}`);
  }

  setDataItem(item) {
    return this.items$.next(item);
  }

  getItemsCount() {
    return this.items$.getValue().length;
  }
}
