import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, CommonModule, FormsModule],
  templateUrl: './notification-settings.component.html',
})
export class NotificationSettingsComponent {
  settings = {
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    evaluationReminders: true,
    performanceFeedback: false,
  };

  constructor (private router: Router) {}

  goBackToSettings() {
    // Lógica para regresar a la pantalla de configuración
  }

  goBackToHome(): void {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  saveChanges() {
    // Lógica para guardar los cambios de configuración
    console.log('Configuraciones guardadas:', this.settings);
  }
}
