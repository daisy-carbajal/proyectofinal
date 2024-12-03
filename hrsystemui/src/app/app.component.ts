import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, RippleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.themeService.initializeTheme();
  
    if (isPlatformBrowser(this.platformId)) {
      this.authService.validateSession().subscribe({
        next: (response) => {
          if (response.valid) {
            console.log('Usuario sigue logueado:', response.user);
            this.router.navigate(['/home']);
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
    } else {
      console.log('Renderización del servidor, saltando validación de sesión.');
    }
  }
  
}