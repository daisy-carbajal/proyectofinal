import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleService } from '../../services/role.service';
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

@Component({
  selector: 'app-roles-view',
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
  ],
  providers: [MessageService, ConfirmationService, RoleService],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './roles-view.component.html',
  styleUrl: './roles-view.component.css'
})
export class RolesViewComponent implements OnInit {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  roles: any[] = [];
  selectedRoles: any[] = [];
  roleDialog: boolean = false;
  role!: any;
  submitted: boolean = false;
  loggedUserId: number |  null = null;


  constructor(
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.roleService.getAllRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
    this.loggedUserId = this.authService.getUserId();
  }

  openNew() {
    this.role = {
      Name: '',
      Description: '',
      CreatedBy: this.loggedUserId,
      UpdatedBy: this.loggedUserId
    };
    this.submitted = false;
    this.roleDialog = true;
  }

  deleteRole(RoleID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este rol?'
    );
    if (confirmed) {
      this.roleService.deleteRole(RoleID).subscribe(
        (response) => {
          console.log('ID de puesto eliminado:', RoleID);
          console.log('Rol eliminado exitosamente', response);

          this.roles = this.roles.filter(
            (role) => role.RoleID !== RoleID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar rol', error);
        }
      );
    }
  }

  editRole(role: any) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  deactivateRole(role: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de borrar ' + role.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log("Rol a Desactivar:"  + role.RoleID);

        this.roleService
          .deactivateRole(role.RoleID, { DeletedBy: this.loggedUserId })

          .subscribe(() => {
            const index = this.findIndexById(role.RoleID);
            if (index !== -1) {
              this.roles[index].status = false;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Rol Borrado.',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }

  saveRole() {
    this.submitted = true;

    if (this.role.Name?.trim() && this.role.Description?.trim()) {
        console.log('Datos del puesto de trabajo antes de actualizar:', this.role);

        if (this.role.RoleID) {
            this.roleService.updateRole(this.role.RoleID, this.role).subscribe(() => {
                const index = this.findIndexById(this.role.RoleID);
                if (index !== -1) {
                    this.roles[index] = this.role;
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Rol Actualizado.',
                    life: 3000,
                });
            });
        } else {
            this.roleService.postRole(this.role).subscribe((newRole) => {
                console.log('Datos del rol antes de enviar:', this.role);
                this.roles.push(newRole);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Rol Creado.',
                    life: 3000,
                });
            });
        }

        this.roles = [...this.roles]; 
        this.roleDialog = false; 
        this.role = {};
    }
}

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].RoleID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}