import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
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
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.themeService.initializeTheme();

    if (!this.authService.isLoggedIn()) {
      console.log('Usuario no logueado. Redirigiendo al login...');
      this.router.navigate(['/login']);
    } else {
      console.log('Usuario sigue logueado.');
    }

    this.authService.validateSession().subscribe({
      next: (response) => {
        if (response.valid) {
          console.log('Usuario sigue logueado:', response.user);
          // Aquí puedes navegar a una página predeterminada (por ejemplo, dashboard)
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
  }
}
