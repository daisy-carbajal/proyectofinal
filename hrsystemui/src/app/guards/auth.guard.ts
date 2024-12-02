import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.validateSession().pipe(
      map((response) => {
        if (response.valid) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return [false];
      })
    );
  }
}