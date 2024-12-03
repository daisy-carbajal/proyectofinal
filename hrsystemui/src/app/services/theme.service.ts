import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private defaultTheme = 'assets/themes/viva-light.css';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectar el ID de la plataforma
  ) {}

  initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Verificar si está en el navegador antes de acceder a localStorage
      const savedTheme =
        localStorage.getItem('app-theme') || 'assets/themes/viva-light.css';
      this.applyTheme(savedTheme);
    } else {
      console.warn('SSR detectado: localStorage no está disponible.');
    }
  }

  setTheme(theme: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('app-theme', theme);
      this.applyTheme(theme);
    } else {
      console.warn('SSR detectado: no se puede guardar el tema en localStorage.');
    }
  }

  getCurrentTheme(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('app-theme') || this.defaultTheme;
    }
    return this.defaultTheme; // Devolver el tema predeterminado si no está en el navegador
  }

  private applyTheme(theme: string): void {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme;
    }
  }
}