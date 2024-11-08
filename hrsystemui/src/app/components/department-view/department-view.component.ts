import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepartmentService } from '../../services/department.service';
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
  selector: 'app-department-view',
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
  providers: [MessageService, ConfirmationService, DepartmentService],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './department-view.component.html',
  styleUrl: './department-view.component.css'
})
export class DepartmentViewComponent implements OnInit {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  departments: any[] = [];
  selectedDepartments: any[] = [];
  departmentDialog: boolean = false;
  department!: any;
  submitted: boolean = false;
  loggedUserId: number | null = null;


  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService:  AuthService,

  ) {}

  ngOnInit() {
    this.departmentService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    });
    this.loggedUserId = this.authService.getUserId();
  }

  openNew() {
    this.department = {
      name: ''
    };
    this.submitted = false;
    this.departmentDialog = true;
  }

  editDepartment(department: any) {
    this.department = { ...department };
    this.departmentDialog = true;
  }

  deleteDepartment(departmentId: number) {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este departamento?');
    if (confirmed) {
      this.departmentService.deleteDepartment(departmentId).subscribe(
        (response) => {
          console.log('ID de departamento eliminado:', departmentId);
          console.log('Departamento eliminado exitosamente', response);
  
          this.departments = this.departments.filter(
            (department) => department.departmentId !== departmentId
          );
  
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Departamento eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar departamento', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el departamento.',
            life: 3000,
          });
        }
      );
    }
  }

  deactivateDepartment(department: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de borrar ' + department.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log("Departamento a Desactivar:"  + department.DepartmentID);

        const deletedBy = this.loggedUserId;

        this.departmentService
          .deactivateDepartment(department.DepartmentID, { DeletedBy: deletedBy })

          .subscribe(() => {
            const index = this.findIndexById(department.DepartmentID);
            if (index !== -1) {
              this.departments[index].status = false;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Departamento Boraddo.',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.departmentDialog = false;
    this.submitted = false;
  }

  saveDepartment() {
    this.submitted = true;

    if (this.department.Name?.trim()) {
        console.log('Datos del puesto de trabajo antes de actualizar:', this.department);

        if (this.department.DepartmentID) {
            this.departmentService.updateDepartment(this.department.DepartmentID, this.department).subscribe(() => {
                const index = this.findIndexById(this.department.DepartmentID);
                if (index !== -1) {
                    this.departments[index] = this.department;
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Departamento Actualizado.',
                    life: 3000,
                });
            });
        } else {
            this.departmentService.postDepartment(this.department).subscribe((newDepartment) => {
                console.log('Datos del departmento antes de enviar:', this.department);
                this.departments.push(newDepartment);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Departamento Creado.',
                    life: 3000,
                });
            });
        }

        this.departments = [...this.departments]; 
        this.departmentDialog = false; 
        this.department = {}; 
    }
}

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.departments.length; i++) {
      if (this.departments[i].JobTitleID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}