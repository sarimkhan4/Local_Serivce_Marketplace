import { inject } from '@angular/core';
import { Router, CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as string[];

  if (authService.isAuthenticated()) {
    const userRole = authService.currentUser()?.role;

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    // Role mismatch, redirect to unauthorized
    return router.parseUrl('/unauthorized');
  }

  return router.parseUrl('/login');
};
