import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  identityCheck() {
    const expirationString = localStorage.getItem("accessTokenExpiration");

    if (!expirationString) {
      _isAuthenticated = false;
      return;
    }

    const expiration = new Date(expirationString);
    const now = new Date();

    if (now >= expiration) {
      _isAuthenticated = false;
      return;
    }

    _isAuthenticated = true;
  }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }
}

export let _isAuthenticated: boolean;