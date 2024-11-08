import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
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

@Component({
  selector: 'app-userdetailview',
  standalone: true,
  imports: [
    ChipsModule,
    CardModule,
    RippleModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [UserService],
  templateUrl: './userdetailview.component.html',
  styleUrls: ['./userdetailview.component.css'],
})
export class UserDetailViewComponent implements OnInit {
  employeeName = '';
  workEmail = '';
  jobTitle = '';
  department = '';
  userId!: number;

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
    { label: 'País', value: '', fieldName: 'Country', isEditing: false },
    {
      label: 'Puesto Laboral',
      value: '',
      fieldName: 'JobTitle',
      isEditing: false,
    },
    {
      label: 'Departamento',
      value: '',
      fieldName: 'Department',
      isEditing: false,
    },
    { label: 'Rol', value: '', fieldName: 'Role', isEditing: false },
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserData(this.userId);
      }
    });
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
          field.isEditing = false; // Salir del modo de edición
        },
        (error) => {
          console.error('Error al actualizar el campo', error);
          this.cancelEdit(field); // Revertir cambios si la actualización falla
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
      case 'Puesto Laboral':
        return data.JobTitle || '';
      case 'Departamento':
        return data.Department || '';
      case 'Rol':
        return data.Role || '';
      default:
        return '';
    }
  }
}
