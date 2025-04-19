import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { OrganizationChartService } from '../../services/organization-chart.service';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';

interface TreeNodeInfo {
  label?: string;
  type?: string;
  styleClass?: string;
  expanded?: boolean;
  data?: any;
  children?: TreeNode[];
}

@Component({
  selector: 'app-organization-chart',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    FormsModule,
    OrganizationChartModule,
    ButtonModule,
  ],
  templateUrl: './organization-chart.component.html',
  styleUrl: './organization-chart.component.css',
})
export class OrganizationChartComponent {
  userHierarchies: any[] = [];
  data: TreeNode[] = [];
  loggedUserId: number | null = null;

  constructor(
    private orgChartService: OrganizationChartService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loggedUserId = this.authService.getUserId();
    this.fetchUserHierarchies();
  }

  fetchUserHierarchies(): void {
    this.orgChartService.getAllUserHierarchies().subscribe(
      (data) => {
        this.userHierarchies = data;
        console.log('Jerarquías de usuario:', this.userHierarchies);
        this.data = this.mapToTreeNodes(this.userHierarchies);
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      (error) => {
        console.error('Error al obtener jerarquías de usuario:', error);
      }
    );
  }

  mapToTreeNodes(hierarchies: any[]): TreeNodeInfo[] {
    const currentUserId = this.loggedUserId; // UserID del usuario actual, reemplazar con valor dinámico si es necesario

    if (currentUserId === null) {
      console.warn('No hay usuario logueado (currentUserId es null).');
      // Aquí puedes mostrar un mensaje en tu componente en lugar de los datos
      throw new Error('No se encontró un usuario logueado.');
    }

    const mapNode = (node: any): TreeNodeInfo => ({
      label: `${node.FirstName} ${node.LastName}`,
      type: 'person',
      expanded: this.expandNodeFocusedonUser(node, currentUserId),
      styleClass: '!bg-purple-100',
      data: {
        name: `${node.FirstName} ${node.LastName}`,
        title: node.JobTitle || 'Sin título',
        manager: node.ManagerName || 'Sin gerente'
      },
      children: node.children
        ? node.children.map((child: any) => mapNode(child))
        : [],
    });

    return hierarchies.map((node) => mapNode(node));
  }

  // Método para verificar si un nodo debe estar expandido
  expandNodeFocusedonUser(node: any, currentUserId: number): boolean {
    if (node.UserID === currentUserId) {
      return true; // Expandir el nodo del usuario actual
    }
    if (
      node.children &&
      node.children.some((child: any) =>
        this.expandNodeFocusedonUser(child, currentUserId)
      )
    ) {
      return true; // Expandir si alguno de los hijos contiene el nodo del usuario
    }
    return false;
  }

  zoomLevel = 1; // Nivel inicial de zoom

  zoomIn() {
    const maxZoom = 2;
    if (this.zoomLevel < maxZoom) {
      this.zoomLevel += 0.1;
    }
  }

  zoomOut() {
    const minZoom = 0.5;
    if (this.zoomLevel > minZoom) {
      this.zoomLevel -= 0.1;
    }
  }
}
