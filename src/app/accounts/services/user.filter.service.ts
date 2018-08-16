import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {Observable} from 'rxjs';

let params = new HttpParams();

@Injectable()
export class UserFilterService extends BaseApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  addSearchParams(key: string, term: string): Observable<any> {
    params = params.set(key, term);
    return this.get(`api/user`, {params});
  }

  removeSearchParams(key: string): Observable<any> {
    params = params.delete(key);
    return this.get(`api/user`, {params});
  }

  clearSearchParams(key: string) {
    params = params.delete(key);
  }

  clearAllSearchParams() {
    params = params.delete('search');
    params = params.delete('status');
    params = params.delete('role');
  }
}
