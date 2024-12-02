import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private defaultTheme = 'assets/themes/viva-light.css';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  initializeTheme(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTheme =
        (typeof localStorage !== 'undefined' &&
          localStorage.getItem('app-theme')) ||
        'assets/themes/viva-light.css';
      this.applyTheme(savedTheme);
    } else {
      console.warn('localStorage no está disponible.');
    }
  }

  setTheme(theme: string): void {
    localStorage.setItem('app-theme', theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): string {
    return localStorage.getItem('app-theme') || this.defaultTheme;
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
