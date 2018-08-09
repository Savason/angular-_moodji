import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class PermissionsService extends BaseApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  getUserPermissions(): Observable<any> {
    return this.get(`api/role/permissions`);
  }
}
