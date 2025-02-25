import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { RoleService } from '../../services/role.service';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserRoleService } from '../../services/user-role.service';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-userdetailview',
  standalone: true,
  imports: [
    CardModule,
    RippleModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, UserService, AuthService, MessageService],
  templateUrl: './userdetailview.component.html',
  styleUrls: ['./userdetailview.component.css'],
})
export class UserDetailViewComponent implements OnInit {
  employeeName = '';
  workEmail = '';
  jobTitle = '';
  department = '';
  userId!: number;
  role = null;
  roleID = null;

  userRoleDialog: boolean = false;
  submitted: boolean = false;
  userRole!: any;
  roles: any[] = [];
  selectedRole: number | null = null;

  loggedUserID: number | null = null;
  isPasswordSet: boolean = false;

  userFields = [
    { label: 'Nombre', value: '', fieldName: 'FirstName', isEditing: false },
    { label: 'Apellido', value: '', fieldName: 'LastName', isEditing: false },
    {
      label: 'Correo Personal',
      value: '',
      fieldName: 'PersonalEmail',
      isEditing: false,
    },
    {
      label: 'Fecha de Nacimiento',
      value: '',
      fieldName: 'BirthDate',
      isEditing: false,
    },
    { label: 'Género', value: '', fieldName: 'Gender', isEditing: false },
    {
      label: '# Teléfono',
      value: '',
      fieldName: 'PhoneNumber',
      isEditing: false,
    },
    {
      label: '# Identificación',
      value: '',
      fieldName: 'TaxID',
      isEditing: false,
    },
    { label: 'Calle', value: '', fieldName: 'StreetAddress', isEditing: false },
    { label: 'Ciudad', value: '', fieldName: 'City', isEditing: false },
    { label: 'Estado', value: '', fieldName: 'State', isEditing: false },
    {
      label: 'Código Postal',
      value: '',
      fieldName: 'PostalCode',
      isEditing: false,
    },
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserData(this.userId);
        this.loadRoles();
      }
    });
    this.loggedUserID = this.authService.getUserId();
  }

  goBackToUsers(): void {
    this.router.navigate(['/home/user'], { replaceUrl: true });
  }

  loadUserData(userId: number): void {
    this.userService.getUserDetailsById(userId).subscribe((data) => {
      console.log('Datos del usuario:', data);
      this.employeeName = `${data.FirstName} ${data.LastName}`;
      this.workEmail = data.WorkEmail;
      this.jobTitle = data.JobTitle || 'Sin puesto asignado';
      this.department = data.Department || 'Sin departamento asignado';
      this.role = data.Role || 'Sin rol asignado';
      this.roleID = data.RoleID;
      this.isPasswordSet = data.isPasswordSet;
      
      this.userFields.forEach((field) => {
        field.value = this.getFieldOriginalValue(data, field.label);
      });
    });
  }

  toggleEdit(field: { isEditing: boolean }): void {
    field.isEditing = true;
  }

  saveEdit(field: {
    fieldName: string;
    value: string;
    isEditing: boolean;
    label: string;
  }): void {
    const updateData = {
      fieldName: field.fieldName,
      newValue: field.value,
    };

    this.userService
      .updateUserField(this.userId, field.fieldName, field.value)
      .subscribe(
        (response) => {
          console.log('Campo actualizado correctamente', response);
          field.isEditing = false;
        },
        (error) => {
          console.error('Error al actualizar el campo', error);
          this.cancelEdit(field);
        }
      );
  }

  cancelEdit(field: {
    fieldName: string;
    value: string;
    isEditing: boolean;
    label: string;
  }): void {
    field.isEditing = false;
    this.userService.getUserDetailsById(this.userId).subscribe((data) => {
      field.value = this.getFieldOriginalValue(data, field.label);
    });
  }

  getFieldOriginalValue(data: any, label: string): string {
    switch (label) {
      case 'Nombre':
        return data.FirstName;
      case 'Apellido':
        return data.LastName;
      case 'Correo Personal':
        return data.PersonalEmail;
      case 'Fecha de Nacimiento':
        return new Date(data.BirthDate).toISOString().split('T')[0];
      case 'Género':
        return data.Gender;
      case '# Teléfono':
        return data.PhoneNumber;
      case '# Identificación':
        return data.TaxID;
      case 'Calle':
        return data.StreetAddress || '';
      case 'Ciudad':
        return data.City || '';
      case 'Estado':
        return data.State || '';
      case 'Código Postal':
        return data.PostalCode || '';
      case 'País':
        return data.Country || '';
      default:
        return '';
    }
  }

  editUserRole(userRole: any) {
    this.userRole = { ...userRole };
    this.selectedRole = userRole.RoleID; // Cambiar a selectedRole
    this.userRoleDialog = true;
  }

  hideDialog() {
    this.userRoleDialog = false;
    this.submitted = false;
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (dataRole) => {
        this.roles = dataRole;
        console.log("Data de Roles:", dataRole);
      },
      (error) => {
        console.error('Error al cargar roles:', error);
      }
    );
  }

  onRoleSelect(event: any) {
    this.selectedRole = event.value;
    console.log('ID del Role seleccionado:', this.selectedRole);
  }

  resendToken(userId: number): void {
    this.userService.resendToken(userId, this.loggedUserID).subscribe(() => {
      this.messageService.add({ severity: 'success', summary:'Confirmación', detail:'Token de verificación enviado con éxito'});
      }, () => {
        this.messageService.add({ severity: 'danger', summary:'Error', detail:'Error al enviar token de verificación'});
        });
  }

  saveUserRole() {
    this.submitted = true;

    if (this.selectedRole) {
        const roleUpdateData = {
            UserID: this.userId, 
            RoleID: this.selectedRole 
        };

        this.userRoleService.updateUserRole(roleUpdateData).subscribe(
            (response) => {
                console.log('Rol actualizado correctamente', response);
                this.loadUserData(this.userId); 
                this.hideDialog();
            },
            (error) => {
                console.log("Datos enviados:", roleUpdateData); 
                console.error('Error al actualizar el rol', error);
            }
        );
    }
}
}
