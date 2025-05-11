
// Removed duplicate import of AppComponent
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    // ...
  ]
});
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';      // ✅  importieren
import { jwtInterceptor } from './app/core/jwt.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,                                    // ✅  Router‑Provider bleibt erhalten
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
}).catch(err => console.error(err));
