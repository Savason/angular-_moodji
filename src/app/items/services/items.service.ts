import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ItemsService extends BaseApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  createNewItem(data): Observable<any> {
    return this.post(`api/item`, data);
  }
}
