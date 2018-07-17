import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {Observable} from 'rxjs';
import {RoleModel} from '../../shared/models/role.model';

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

  getUsersRoles(): Observable<any> {
    return this.get(`api/role`);
  }

  createUserRole(role: RoleModel): Observable<any> {
    return this.post(`api/role`, role);
  }

  changeUserRole(id: string | number, data): Observable<any> {
    return this.put(`api/role/${id}`, data);
  }

  deleteUserRole(id: string | number): Observable<any> {
    return this.delete(`api/role/${id}`);
  }

  addPermissionToRole(id: string | number, data): Observable<any> {
    return this.put(`api/role/${id}/permission`, data);
  }

  deletePermissionToRole(id: string | number, data): Observable<any> {
    return this.delete(`api/role/${id}/permission`, data);
  }
}
