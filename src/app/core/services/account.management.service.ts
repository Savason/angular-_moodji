import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {Observable} from 'rxjs';
import {User} from '../../shared/models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountManagementService extends BaseApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  createNewUser(user: User): Observable<any> {
    return this.post('api/user', user, httpOptions);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.get(`api/email/${email}`);
  }

  getUserRole(): Observable<any> {
    return this.get('api/role');
  }

}
