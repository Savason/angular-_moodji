import {Injectable} from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAuthService} from '../../auth/services/user.auth.service';
import {tap} from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: UserAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const access_token = JSON.parse(localStorage.getItem('access_token'));
    // console.log(request.url.indexOf('http://lws.testly.space/'));

    if (access_token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`
        }
      });
    }
    return next.handle(request).pipe(
      tap(error => {
        return false;
      }, error => {
        // console.error('NICE ERROR', error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.authService.logout();
          }
        }
      })
    );
  }
}
