import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../shared/models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class AccountManagementService extends BaseApi {
  public Users = [];
  public userRoles = [];
  public totalUserCount = 0;
  public Users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.Users);
  public userRoles$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.userRoles);
  public currentUserIdDelete;
  public currentEditedUser;

  constructor(public http: HttpClient) {
    super(http);
  }

  createNewUser(user: User): Observable<any> {
    return this.post('api/user', user, httpOptions);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.get(`api/user/email?email=${email}`);
  }

  getUserById(id: string | number): Observable<any> {
    return this.get(`api/user/${id}`);
  }

  getAllUsers(searchParams): Observable<any> {
    return this.get(`api/user?page=${searchParams}`);
  }

  getUserRole(): Observable<any> {
    return this.get('api/role');
  }

  deleteCurrentUser(id: number): Observable<any> {
    return this.delete(`api/user/${id}`);
  }

  changeUser(id: number | string, data): Observable<any> {
    const headers = new HttpHeaders(data);
    return this.put(`api/user/${id}`, data, headers);
  }

  activateUser(id: string | number): Observable<any> {
    return this.post(`api/user/activate/${id}`);
  }

  deactivateUser(id: string | number): Observable<any> {
    return this.post(`api/user/disable/${id}`);
  }

  getUsers() {
    return this.Users$;
  }

  setDataUser(data) {
    return this.Users$.next(data);
  }

  addToUserList(data) {
    if (this.getUserCount() < 10) {
      this.Users$.next(this.Users$.getValue().concat(data));
    } else {
      return;
    }
  }

  getUserCount() {
    return this.Users$.getValue().length;
  }

  getUserRoles() {
    return this.userRoles$;
  }

  setDataUserRoles(data) {
    return this.userRoles$.next(data);
  }
}


