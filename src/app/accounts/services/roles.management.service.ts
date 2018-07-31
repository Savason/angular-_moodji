import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {Observable} from 'rxjs';

@Injectable()
export class RolesManagementService extends BaseApi {
  public newPermissionsList = [];
  public permissionList;
  public editedRole;

  constructor(public http: HttpClient) {
    super(http);
  }

  getUsersRoles(): Observable<any> {
    return this.get(`api/role`);
  }

  getPermissionTable(): Observable<any> {
    return this.get(`api/permission`);
  }

  getRoleByKey(key: string | number): Observable<any> {
    return this.get(`api/role/${key}`);
  }

  getUsersByRoleId(id: number): Observable<any> {
    return this.get(`api/users/role/${id}`);
  }

  createUserRole(role): Observable<any> {
    return this.post(`api/role`, role);
  }

  changeUserRole(data): Observable<any> {
    return this.put(`api/role`, data);
  }

  deleteUserRole(id: string | number, redefineId?: string | number): Observable<any> {
    return this.delete(`api/role/${id}?role_id=${redefineId}`);
  }

  addPermissionToRole(data): Observable<any> {
    return this.post(`api/role/permissions/manage`, data);
  }

  deletePermissionToRole(data): Observable<any> {
    return this.delete(`api/role/permissions/manage?permission_id=${data.permission_id}&role_id=${data.role_id}`);
  }
}
