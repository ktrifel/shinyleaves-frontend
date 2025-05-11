import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService }         from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {

  canActivate: CanActivateFn = () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (auth.isLogged()) {
      return true;
    }
    /* nicht eingeloggt → erst Login, danach weiterleiten */
    router.navigate(['/login'], { queryParams: { redirect: 'checkout' } });
    return false;
  };
}
