import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeService } from './app/services/theme.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
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