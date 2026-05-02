import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');
  
  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const url = typeof req.url === 'string' ? req.url : '';
        const authAttempt = url.includes('/auth/login') || url.includes('/auth/signup');
        if (!authAttempt) {
          authService.clearSession();
          void router.navigate(['/login'], { replaceUrl: true });
        }
      }
      return throwError(() => error);
    })
  );
};
