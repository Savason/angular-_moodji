import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: boolean;
  loginEventEmitter = new EventEmitter<boolean>();

  constructor(private router: Router) {
  }

  login() {
    console.log('login');
    this.loginEventEmitter.emit(true);
    this.router.navigate(['']);
    this.isLoggedIn = true;
  }

  logout() {
    this.router.navigate(['/login']);
    this.loginEventEmitter.emit(false);
  }

  rr() {
    return this.isLoggedIn;
  }
}
