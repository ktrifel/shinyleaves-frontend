import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  /* nicht eingeloggt → erst Login, danach weiterleiten */
  router.navigate(['/login'], { queryParams: { redirect: 'checkout' } });
  return false;
};
