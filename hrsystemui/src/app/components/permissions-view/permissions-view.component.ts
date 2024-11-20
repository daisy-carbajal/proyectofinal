import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../services/auth.service';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PermissionService } from '../../services/permission.service';
import { PermissionCategoryService } from '../../services/permission-category.service';

@Component({
  selector: 'app-permissions-view',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    CalendarModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    PermissionService,
    PermissionCategoryService,
  ],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
 ],
  templateUrl: './permissions-view.component.html',
  styleUrls: ['./permissions-view.component.css']
})
export class PermissionsViewComponent implements OnInit {
  filterGlobal(value: string) {
    // Implementa la lógica de filtrado si es necesario
  }

  permissions: any[] = [];
  selectedPermissions: any[] = [];
  permissionDialog: boolean = false;
  permission!: any;
  submitted: boolean = false;
  loggedUserId: number | null = null;
  permissionCategory: any[] = [];
  permissionCategorySelected: number | null = null;
  users: any[] = [];
  userSelected: number | null = null;
  timeValue: number | null = null;
  selectedTimeUnit: string = 'mins';

  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private permissionCategoryService: PermissionCategoryService,
  ) {}

  ngOnInit() {
    this.permissionService.getAllPermissions().subscribe((data: any[]) => {
      console.log('Datos de permisos:', data);
      this.permissions = data;
    });
    this.loggedUserId = this.authService.getUserId();
    this.loadPermissionCategories();
  }

  openNew() {
    this.permission = {
      PermissionID: null,
      PermissionName: null,
      Description: '',
      CategoryID: null
    };
    this.submitted = false;
    this.permissionDialog = true;
  }

  loadPermissionCategories(): void {
    this.permissionCategoryService.getAllPermissionCategories().subscribe(
      (data) => {
        console.log('Categorías cargadas:', data);
        this.permissionCategory = data;
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  onPermissionCategorySelect(event: any) {
    this.permissionCategorySelected = event.value;
    this.permission.CategoryID = this.permissionCategorySelected; 
    console.log('ID de la categoria seleccionada:', this.permissionCategorySelected);
  }

  onCategoryChange(event: any) {
    console.log('Categoría seleccionada:', event.value);
    console.log('Objeto permiso actualizado:', this.permission);
  }

  editPermission(permission: any) {
    this.permission = { ...permission };
    if (this.permission.Date) {
      this.permission.Date = new Date(this.permission.Date);
    }
    this.permission.CategoryID = this.permission.PermissionCategoryID;
    this.permissionDialog = true;
  }

  deletePermission(PermissionID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este permission?'
    );
    if (confirmed) {
      this.permissionService.deletePermission(PermissionID).subscribe(
        (response) => {
          console.log('ID de permission eliminado:', PermissionID);
          console.log('Permission eliminado exitosamente', response);

          this.permissions = this.permissions.filter(
            (permission) => permission.PermissionID !== PermissionID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Permission eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar permission', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el permission.',
            life: 3000,
          });
        }
      );
    }
  }

  deactivatePermission(permission: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro de borrar ${permission.PermissionName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!permission.PermissionID) {
          console.error('PermissionID no válido:', permission.PermissionID);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El PermissionID no es válido.',
            life: 3000,
          });
          return;
        }
  
        console.log('Permission a desactivar:', permission.PermissionID);
  
        this.permissionService.deactivatePermission(permission.PermissionID).subscribe(
          (response) => {
            console.log('Respuesta de desactivación:', response);
  
            const index = this.findIndexById(permission.PermissionID);
            if (index !== -1) {
              this.permissions[index].status = false; 
            }
  
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Permiso desactivado correctamente.',
              life: 3000,
            });
          },
          (error) => {
            console.error('Error al desactivar permiso:', error);
  
            // Manejar error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo desactivar el permiso.',
              life: 3000,
            });
          }
        );
      },
    });
  }

  refreshRoles() {
    this.permissionService.getAllPermissions().subscribe((data: any[]) => {
      this.permissions = data;
    });
  }

  hideDialog() {
    this.permissionDialog = false;
    this.submitted = false;
  }

  savePermission() {
    this.submitted = true;
  
    if (this.permission.PermissionName?.trim()) {
      console.log('Datos del permiso antes de actualizar:', this.permission);
  
      if (this.permission.PermissionID) {
        this.permissionService
          .updatePermission(this.permission.PermissionID, this.permission) // Asegúrate de que esta línea esté descomentada
          .subscribe(() => {
            const index = this.findIndexById(this.permission.PermissionID);
            if (index !== -1) {
              this.permissions[index] = this.permission;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Permission Actualizado.',
              life: 3000,
            });
          });
      } else {
        this.permissionService
          .postPermission({
            PermissionName: this.permission.PermissionName,
            Description: this.permission.Description,
            CategoryID: this.permission.CategoryID
          })
          .subscribe((newPermission) => {
            console.log('Datos del permiso antes de enviar:', newPermission);
            this.permissions.push(newPermission);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Permission Creado.',
              life: 3000,
            });
          });
      }
      this.refreshRoles();
      this.permissionDialog = false;
      this.permission = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i].PermissionID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}