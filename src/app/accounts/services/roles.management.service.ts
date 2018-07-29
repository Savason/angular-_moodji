import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {Observable} from 'rxjs';

@Injectable()
export class RolesManagementService extends BaseApi {
  public newPermissionsList = [];
  public permissionList;
  public editedRole = {roleId: '', name: ''};

  constructor(public http: HttpClient) {
    super(http);
  }

  getPermissionTable(): Observable<any> {
    return this.get(`api/permission`);
  }

  getRoleByName(name: string): Observable<any> {
    return this.get(`api/role/${name}`);
  }

  createUserRole(role): Observable<any> {
    return this.post(`api/role`, role);
  }

  changeUserRole(data): Observable<any> {
    return this.put(`api/role`, data);
  }

  deleteUserRole(id: string | number): Observable<any> {
    return this.delete(`api/role/${id}`);
  }

  addPermissionToRole(data): Observable<any> {
    return this.post(`api/role/permissions/manage`, data);
  }

  deletePermissionToRole(data): Observable<any> {
    return this.delete(`api/role/permissions/manage?permission_id=${data.permission_id}&role_id=${data.role_id}`);
  }
}
