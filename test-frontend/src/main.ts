// src/main.ts
import { enableProdMode }                    from '@angular/core';
import { bootstrapApplication }              from '@angular/platform-browser';
import { provideRouter }                     from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent }      from './app/app.component';
import { routes }            from './app/app.routes';        // <-- hier deine routes
import { environment }       from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // HTTP-Client registrieren
    provideHttpClient(withInterceptorsFromDi()),

    // Router mit deinen "routes"
    provideRouter(routes),

    // falls du BrowserAnimations brauchst:
    // importProvidersFrom(BrowserAnimationsModule),
  ]
})
.catch(err => console.error('Bootstrap-Error:', err));
