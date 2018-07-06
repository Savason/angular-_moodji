import {EventEmitter, Injectable} from '@angular/core';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class UserAuthService extends BaseApi {
  private isLoggedIn: boolean;
  loginEventEmitter = new EventEmitter<boolean>();

  constructor(public http: HttpClient,
              private router: Router) {
    super(http);
  }

  login = ({username, password}): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    });

    const authData = {
      'grant_type': 'password',
      'client_id': '1_40q25wnhzv8k4w0kcks8c8sk4wk4s00wco4cw08k4kgk04ck4c',
      'client_secret': '5xnyqtkp8eg40cg44ocssggkc088o8k4k00csg84o4c008ows0',
      'username': `${username}`,
      'password': `${password}`
    };

    return this.post('oauth/v2/token', authData, {headers: headers})
      .pipe(map((response: any) => {
        console.log(response);
        localStorage.clear();
        if (response.access_token) {
          localStorage.setItem('access_token', JSON.stringify(response.access_token));
          this.loginEventEmitter.emit(true);
          this.isLoggedIn = true;
        }
        return response;
      }));
  };

  logout() {
    window.localStorage.clear();
    this.router.navigate(['/login']);
    this.loginEventEmitter.emit(false);
  }
}
