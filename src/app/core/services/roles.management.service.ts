import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {Observable} from 'rxjs';

@Injectable()
export class RolesManagementService extends BaseApi {
  public permissionTable;
  public permision = [];
  public roles = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getPermissionTable(): Observable<any> {
    return this.get(`api/permission`);
  }
}
