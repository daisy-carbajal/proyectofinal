import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobtitleService } from '../../services/jobtitle.service';
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
import { DepartmentService } from '../../services/department.service';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-title-view',
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
  providers: [MessageService, ConfirmationService, JobtitleService],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './job-title-view.component.html',
  styleUrl: './job-title-view.component.css',
})
export class JobTitleViewComponent implements OnInit {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  jobtitles: any[] = [];
  selectedJobTitles: any[] = [];
  jobTitleDialog: boolean = false;
  jobTitle!: any;
  submitted: boolean = false;
  departments: any[] = [];
  selectedDepartment: number | null = null;
  roles: any[] = [];
  selectedRole: number | null = null;
  loggedUserId: number | null = null;

  constructor(
    private jobTitleService: JobtitleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private departmentService: DepartmentService,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.jobTitleService.getAllJobTitleDetails().subscribe((data: any[]) => {
      this.jobtitles = data;
    });
    this.loadDepartments();
    this.loadRoles();
    this.loggedUserId = this.authService.getUserId();
    console.log(this.loggedUserId);
  }

  openNew() {
    this.jobTitle = {
      title: '',
      description: '',
      departmentId: null,
      roleId: null,
      createdby: this.loggedUserId,
    };
    this.submitted = false;
    this.jobTitleDialog = true;
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      (dataDepto) => {
        this.departments = dataDepto;
      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    );
  }

  onDepartmentSelect(event: any) {
    this.selectedDepartment = event.value;
    console.log('ID del Departamento seleccionado:', this.selectedDepartment);
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (dataRole) => {
        this.roles = dataRole;
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

  deactivateJobTitle(jobTitleID: number) {
    const jobTitle = this.jobtitles.find((jt) => jt.JobTitleID === jobTitleID);

    if (!jobTitle) {
      console.error('Puesto de trabajo no encontrado');
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de desactivar el puesto: ${jobTitle.JobTitle}?`,
      header: 'Confirmar Desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletedBy = this.loggedUserId;

        console.log(jobTitleID,  deletedBy);

        this.jobTitleService
          .deactivateJobTitle(jobTitleID, jobTitle)
          .subscribe(() => {
            jobTitle.status = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Puesto de trabajo desactivado.',
              life: 3000,
            });
          });
      },
    });
  }

  deactivateSelectedJobTitles() {
    this.confirmationService.confirm({
      message: '¿Está seguro de desactivar los puestos seleccionados?',
      header: 'Confirmar Desactivación Múltiple',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deactivateRequests = this.selectedJobTitles.map((jobTitle) =>
          this.jobTitleService.deactivateJobTitle(jobTitle.JobTitleID, {
            DeletedBy: this.loggedUserId,
          })
        );

        Promise.all(deactivateRequests).then(
          () => {
            this.jobtitles = this.jobtitles.map((jobTitle) =>
              this.selectedJobTitles.includes(jobTitle)
                ? { ...jobTitle, status: false }
                : jobTitle
            );

            this.selectedJobTitles = [];

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Puestos desactivados correctamente.',
              life: 3000,
            });
          },
          (error) => {
            console.error('Error al desactivar puestos', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudieron desactivar algunos puestos.',
              life: 3000,
            });
          }
        );
      },
    });
  }

  editJobTitle(jobTitle: any) {
    this.jobTitle = { ...jobTitle };
    this.jobTitleDialog = true;
  }

  deleteJobTitle(JobTitleID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este puesto?'
    );
    if (confirmed) {
      this.jobTitleService.deleteJobTitle(JobTitleID).subscribe(
        (response) => {
          console.log('ID de puesto eliminado:', JobTitleID);
          console.log('Puesto eliminado exitosamente', response);

          this.jobtitles = this.jobtitles.filter(
            (jobTitle) => jobTitle.JobTitleID !== JobTitleID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Puesto eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar puesto', error);
        }
      );
    }
  }

  deleteSelectedJobTitles() {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar los puestos seleccionados?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteRequests = this.selectedJobTitles.map((jobTitle) =>
          this.jobTitleService.deleteJobTitle(jobTitle.JobTitleID)
        );

        Promise.all(deleteRequests).then(
          () => {
            this.jobtitles = this.jobtitles.filter(
              (jobTitle) => !this.selectedJobTitles.includes(jobTitle)
            );

            this.selectedJobTitles = [];

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Puestos eliminados correctamente.',
              life: 3000,
            });
          },
          (error) => {
            console.error('Error al eliminar puestos', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudieron eliminar algunos puestos.',
              life: 3000,
            });
          }
        );
      },
    });
  }

  hideDialog() {
    this.jobTitleDialog = false;
    this.submitted = false;
  }

  saveJobTitle() {
    this.submitted = true;
  
    if (this.jobTitle.JobTitle?.trim() && this.jobTitle.Description?.trim()) {
      console.log('Datos del puesto de trabajo antes de guardar:', this.jobTitle);
  
      if (this.jobTitle.JobTitleID) {
        this.jobTitleService
          .updateJobTitle(this.jobTitle.JobTitleID, {
            Title: this.jobTitle.JobTitle,
            Description: this.jobTitle.Description
          })
          .subscribe(() => {
            const index = this.findIndexById(this.jobTitle.JobTitleID);
            if (index !== -1) {
              this.jobtitles[index] = { ...this.jobTitle };
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Puesto de Trabajo Actualizado.',
              life: 3000,
            });
            this.jobTitleDialog = false;
            this.jobTitle = {};
          });
      } else {
        this.jobTitleService.postJobTitle(this.jobTitle).subscribe((newJobTitle) => {
          this.jobtitles.push(newJobTitle);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Puesto de Trabajo Creado.',
            life: 3000,
          });
          this.jobTitleDialog = false;
          this.jobTitle = {};
        });
      }
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.jobtitles.length; i++) {
      if (this.jobtitles[i].JobTitleID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}