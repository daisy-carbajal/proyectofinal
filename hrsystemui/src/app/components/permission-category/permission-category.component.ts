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
import { UserService } from '../../services/user.service';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PermissionCategoryService } from '../../services/permission-category.service';

@Component({
  selector: 'app-permission-category',
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
    PermissionCategoryService,
    UserService,
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
  templateUrl: './permission-category.component.html',
  styleUrl: './permission-category.component.css'
})
export class PermissionCategoryComponent implements OnInit {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  permissionCategories: any[] = [];
  selectedPermissionCategories: any[] = [];
  permissionCategoryDialog: boolean = false;
  permissionCategory!: any;
  submitted: boolean = false;
  loggedUserId: number | null = null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private permissionCategoryService: PermissionCategoryService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.permissionCategoryService.getAllPermissionCategories().subscribe((data: any[]) => {
      console.log('Datos de categorias:', data);
      this.permissionCategories = data;
    });
    this.loggedUserId = this.authService.getUserId();
  }

  openNew() {
    this.permissionCategory = {
      Name: ''
    };
    this.submitted = false;
    this.permissionCategoryDialog = true;
  }

  editPermissionCategory(permissionCategory: any) {
    this.permissionCategory = { ...permissionCategory };
    this.permissionCategoryDialog = true;
  }

  deletePermissionCategory(PermissionCategoryID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este incident?'
    );
    if (confirmed) {
      this.permissionCategoryService.deletePermissionCategory(PermissionCategoryID).subscribe(
        (response) => {
          console.log('ID de categoria eliminada:', PermissionCategoryID);
          console.log('Categoria eliminada exitosamente', response);

          this.permissionCategories = this.permissionCategories.filter(
            (permissionCategory) => permissionCategory.PermissionCategoryID !== PermissionCategoryID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoria eliminada correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar categoria', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar categoria.',
            life: 3000,
          });
        }
      );
    }
  }

  deactivatePermissionCategory(permissionCategory: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de borrar ' + permissionCategory.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Categoria a Desactivar:' + permissionCategory.PermissionCategoryID);

        const deletedBy = this.loggedUserId;

        this.permissionCategoryService
          .deactivatePermissionCategory(permissionCategory.PermissionCategoryID, { DeletedBy: deletedBy })

          .subscribe(() => {
            const index = this.findIndexById(permissionCategory.PermissionCategoryID);
            if (index !== -1) {
              this.permissionCategories[index].status = false;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Categoria Borrada.',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.permissionCategoryDialog = false;
    this.submitted = false;
  }

  savePermissionCategory() {
    this.submitted = true;

    if (this.permissionCategory.Name?.trim()) {
      console.log('Datos de la categoría antes de actualizar:', this.permissionCategory);

      if (this.permissionCategory.IncidentID) {
        this.permissionCategoryService
          .updatePermissionCategory(this.permissionCategory.PermissionCategoryID, this.permissionCategory)
          .subscribe(() => {
            const index = this.findIndexById(this.permissionCategory.PermissionCategoryID);
            if (index !== -1) {
              this.permissionCategories[index] = this.permissionCategory;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Categoria Actualizada.',
              life: 3000,
            });
          });
      } else {
        this.permissionCategoryService
          .postPermissionCategory(this.permissionCategory)
          .subscribe((newPermissionCategory) => {
            console.log('Datos del incidente antes de enviar:', this.permissionCategory);
            this.permissionCategories.push(newPermissionCategory);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Incidente Creado.',
              life: 3000,
            });
          });
      }
      this.permissionCategoryDialog = false;
      this.permissionCategory = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.permissionCategories.length; i++) {
      if (this.permissionCategories[i].PermissionCategoryID === id) {
        index = i;
        break;
      }
    }

    return index;
  }

}