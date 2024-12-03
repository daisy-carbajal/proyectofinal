import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RolePermissionService } from '../../services/role-permission.service';
import { PermissionCategoryService } from '../../services/permission-category.service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { RoleService } from '../../services/role.service';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ThemeService } from '../../services/theme.service';
import { UserPreferenceService } from '../../services/user-preference.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ButtonModule,
    FormsModule,
    CheckboxModule,
    CommonModule,
    ChipsModule,
    ToolbarModule,
    SelectButtonModule,
  ],
  providers: [
    RolePermissionService,
    PermissionCategoryService,
    RoleService,
    UserPreferenceService,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  // Opciones para el selectButton
  stateOptions = [
    {
      icon: 'pi pi-sun',
      label: 'Claro',
      value: 'assets/themes/viva-light.css',
    },
    {
      icon: 'pi pi-moon',
      label: 'Oscuro',
      value: 'assets/themes/viva-dark.css',
    },
  ];

  value: string; // Tema seleccionado

  loggedUserID: number | null = null;

  enablePushNotifications!: boolean;
  enableEmailNotifications!: boolean;

  constructor(
    private themeService: ThemeService,
    private userPreferenceService: UserPreferenceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.value = this.themeService.getCurrentTheme();
  this.enablePushNotifications = false; // Valor inicial
  this.enableEmailNotifications = false; // Valor inicial
  }

  ngOnInit(): void {
  this.loggedUserID = this.authService.getUserId();

  if (this.loggedUserID) {
    this.userPreferenceService.getPreferences(this.loggedUserID).subscribe({
      next: (preferences: any) => {
        this.enablePushNotifications = preferences.EnablePushNotifications ?? false; 
        this.enableEmailNotifications = preferences.EnableEmailNotifications ?? false;
        console.log('Preferencias cargadas:', preferences);
      },
      error: (err) => console.error('Error al cargar preferencias:', err),
    });
  } else {
    console.error('El ID del usuario no es válido o no está definido.');
  }
}

  toggleTheme(theme: string): void {
    this.themeService.setTheme(theme); // Actualiza el tema usando el servicio
    this.value = theme; // Actualiza el valor seleccionado
  }

  onPushNotificationChange(): void {
    if (this.loggedUserID) {
      this.userPreferenceService
        .savePreferences(this.loggedUserID, {
          push: this.enablePushNotifications,
          email: this.enableEmailNotifications, // Mantén el estado actual
        })
        .subscribe({
          next: () =>
            console.log('Preferencia de notificaciones push actualizada'),
          error: (err) =>
            console.error('Error al actualizar preferencia push:', err),
        });
    }
  }

  onEmailNotificationChange(): void {
    if (this.loggedUserID) {
      this.userPreferenceService
        .savePreferences(this.loggedUserID, {
          push: this.enablePushNotifications, // Mantén el estado actual
          email: this.enableEmailNotifications,
        })
        .subscribe({
          next: () =>
            console.log('Preferencia de notificaciones email actualizada'),
          error: (err) =>
            console.error('Error al actualizar preferencia email:', err),
        });
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      console.log('Sesión cerrada');
    });
  }

  goToChangePassword(): void {
    this.logout();
    this.router.navigate(['/confirm-email'], { replaceUrl: true });
  }
}
