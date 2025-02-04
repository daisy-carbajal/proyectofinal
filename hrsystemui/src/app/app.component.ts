import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, RippleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private excludedRoutes = [
    '/reset-password',
    '/confirm-email',
    '/complete-registration',
  ]; // Lista de rutas excluidas

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.themeService.initializeTheme();

    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(
          filter(
            (event: Event): event is NavigationEnd =>
              event instanceof NavigationEnd
          )
        )
        .subscribe((event: NavigationEnd) => {
          const currentRoute = event.urlAfterRedirects;

          if (this.isExcludedRoute(currentRoute)) {
            console.log(
              `Ruta excluida: ${currentRoute}. No se valida la sesión.`
            );
            return;
          }

          this.validateSession(currentRoute);
        });
    } else {
      console.log('Renderización del servidor, saltando validación de sesión.');
    }
  }

  private isExcludedRoute(route: string): boolean {
    return this.excludedRoutes.some((excludedRoute) =>
      route.startsWith(excludedRoute)
    );
  }

  private validateSession(currentRoute: string) {
    this.authService.validateSession().subscribe({
      next: (response) => {
        if (response.valid) {
          console.log('Usuario sigue logueado:', response.user);

          // Solo redirige al home si el usuario está en el login
          if (currentRoute === '/login') {
            this.router.navigate(['/home']);
          }
        } else {
          console.log('Sesión no válida. Redirigiendo al login...');
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        console.log('Error al validar la sesión. Redirigiendo al login...');
        this.router.navigate(['/login']);
      },
    });
  }

  logInfo() {
    this.logger.log('📢 Esto es un mensaje de información', 'info');
  }

  logWarning() {
    this.logger.log('⚠️ Esto es una advertencia', 'warn');
  }

  logError() {
    this.logger.log('❌ Esto es un error', 'error');
  }
}
