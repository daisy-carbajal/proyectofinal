import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RolePermissionService } from '../../services/role-permission.service';
import { PermissionCategoryService } from '../../services/permission-category.service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RoleService } from '../../services/role.service';

interface Permission {
  PermissionID: number;
  PermissionName: string;
  Description: string;
  Status: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  CategoryName: string;
}

interface Role {
  RoleName: string;
  RoleDescription: string;
  PermissionID: number;
}

@Component({
  selector: 'app-role-permission-detail-view',
  standalone: true,
  imports: [
    ButtonModule,
    FormsModule,
    CheckboxModule,
    CommonModule,
    ChipsModule,
  ],
  providers: [RolePermissionService, PermissionCategoryService, RoleService],
  templateUrl: './role-permission-detail-view.component.html',
  styleUrls: ['./role-permission-detail-view.component.css'],
})
export class RolePermissionDetailViewComponent implements OnInit {
  roles: Role[] = [];
  groupedPermissions: { category: string; permissions: Permission[] }[] = [];
  selectedPermissions: number[] = [];
  roleName: string = '';
  roleDescription: string = '';
  roleId!: number;

  isEditing: boolean = false;

  constructor(
    private rolePermissionService: RolePermissionService,
    private route: ActivatedRoute,
    private permissionCategoryService: PermissionCategoryService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.roleId = +id;
        this.loadRoleDataAndPermissions(this.roleId);
      }
    });
  }

  goBackToRoles(): void {
    this.router.navigate(['/home/roles'], { replaceUrl: true });
  }

  loadRoleDataAndPermissions(roleId: number): void {
    // Cargar los datos del rol
    this.roleService.getRoleById(roleId).subscribe(
      (dataRole) => {
        console.log('Datos del Rol:', dataRole);
        this.roleName = dataRole.Name;
        this.roleDescription = dataRole.Description;
  
        // Cargar permisos después de que los datos del rol se hayan cargado
        this.loadPermissionsAndRole(roleId);
      },
      (error) => {
        console.error('Error al cargar datos del rol:', error);
      }
    );
  }

  private loadPermissionsAndRole(roleId: number) {
    this.permissionCategoryService
      .getAllPermissionsByCategories()
      .pipe(
        catchError((error) => {
          console.error('Error fetching permissions:', error);
          return of([]);
        })
      )
      .subscribe((permissions: Permission[]) => {
        const categories = new Map<string, Permission[]>();
        permissions.forEach((permission) => {
          const category = permission.CategoryName;
          if (!categories.has(category)) {
            categories.set(category, []);
          }
          categories.get(category)?.push(permission);
        });
  
        this.groupedPermissions = Array.from(
          categories,
          ([category, permissions]) => ({
            category,
            permissions,
          })
        );
  
        console.log('Grouped Permissions:', this.groupedPermissions);
      });
  
    this.rolePermissionService
      .getRolePermissionsByRoleID(roleId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching role permissions:', error);
          return of([]);
        })
      )
      .subscribe((roles: Role[]) => {
        this.roles = roles;
  
        if (this.roles.length > 0) {
          this.selectedPermissions = this.roles.map((role) => role.PermissionID);
        }
      });
  }

  editPermissions() {
    this.isEditing = true; // Cambiar a modo de edición
  }

  savePermissions() {
    // Lógica para guardar los permisos seleccionados
    console.log('Permisos guardados:', this.selectedPermissions);
    this.isEditing = false; // Salir del modo de edición
  }

  cancelEdit() {
    // Lógica para cancelar la edición
    this.isEditing = false; // Salir del modo de edición
    // Aquí puedes restaurar los permisos seleccionados si es necesario
  }
}
