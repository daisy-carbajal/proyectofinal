import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import * as Sentry from "@sentry/angular";

import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom, inject } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeService } from './app/services/theme.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

Sentry.init({
  dsn: "https://c0f0ca155b0b2d9a3c884138e83643d8@o4508469580988416.ingest.us.sentry.io/4508473263652864",
  integrations: [
  ],
});

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    ThemeService,
    {
      provide: 'APP_INITIALIZER',
      useFactory: () => {
        const themeService = inject(ThemeService);
        return () => themeService.initializeTheme(); // Inicializa el tema
      },
      multi: true,
    },
  ],
}).catch((err) => console.error(err));