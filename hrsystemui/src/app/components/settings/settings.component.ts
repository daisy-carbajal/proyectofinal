import { Component, Inject, OnInit } from '@angular/core';
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
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

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
    SelectButtonModule
  ],
  providers: [RolePermissionService, PermissionCategoryService, RoleService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent  {
  // Opciones para el selectButton
  stateOptions = [
    { icon:'pi pi-sun', label: 'Claro', value: 'assets/themes/viva-light.css' },
    { icon:'pi pi-moon', label: 'Oscuro', value: 'assets/themes/viva-dark.css' }
  ];

  value: string; // Tema seleccionado

  constructor(private themeService: ThemeService) {
    // Obtiene el tema actual al cargar el componente
    this.value = this.themeService.getCurrentTheme();
  }

  // Cambia el tema cuando el usuario selecciona una opción
  toggleTheme(theme: string): void {
    this.themeService.setTheme(theme); // Actualiza el tema usando el servicio
    this.value = theme; // Actualiza el valor seleccionado
  }
}