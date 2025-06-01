import { inject, Injectable } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { _isAuthenticated, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SilentRefreshService {

  private refreshNeeded = new Subject<void>();
  private timerSubscription: Subscription | null = null;
  private authService: AuthService = inject(AuthService);

  // Diğer servislerde subscribe olunacak Observable
  get refreshNeeded$() {
    return this.refreshNeeded.asObservable();
  }

  start() {
    this.authService.identityCheck();
    if (!_isAuthenticated) return;
    this.stop(); // varsa eski timerı iptal et

    const refreshBeforeTime = parseInt(localStorage.getItem("refreshBeforeTime")) * 1000;

    const expirationStr = localStorage.getItem("accessTokenExpiration");
    if (!expirationStr) return;
    const expiration = new Date(expirationStr);

    const expiresInMs = expiration.getTime() - Date.now();
    const timerDelay = expiresInMs > refreshBeforeTime ? expiresInMs - refreshBeforeTime : 0;

    this.timerSubscription = timer(timerDelay).subscribe(() => {
      this.refreshNeeded.next();
    });
  }

  stop() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}
