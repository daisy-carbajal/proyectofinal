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
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { JobLevelService } from '../../services/job-level.service';

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
    TagModule,
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    DropdownModule
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
  jobTitleEditDialog: boolean = false;
  jobTitle!: any;
  submitted: boolean = false;
  departments: any[] = [];
  selectedDepartment: number | null = null;
  roles: any[] = [];
  selectedRole: number | null = null;
  loggedUserId: number | null = null;
  levels: any[] = [];
  selectedLevel: number | null = null;

  constructor(
    private jobTitleService: JobtitleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private departmentService: DepartmentService,
    private roleService: RoleService,
    private authService: AuthService,
    private levelService: JobLevelService
  ) {}

  ngOnInit() {
    this.jobTitleService.getAllJobTitleDetails().subscribe((data: any[]) => {
      this.jobtitles = data;
      console.log("Puestos Laborales:", data)
    });
    this.loadDepartments();
    this.loadRoles();
    this.loggedUserId = this.authService.getUserId();
    console.log(this.loggedUserId);
    this.loadLevels();
  }

  openNew() {
    this.jobTitle = {
      Title: '',
      Description: '',
      DepartmentID: null,
      RoleID: null,
      LevelID: null,
      CreatedBy: this.loggedUserId,
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

  loadLevels(): void {
    this.levelService.getAllJobLevels().subscribe(
      (dataLevel) => {
        this.levels = dataLevel;
        console.log(dataLevel);
      },
      (error) => {
        console.error('Error al cargar niveles:', error);
      }
    );
  }

  onLevelSelected(event: any) {
    this.selectedLevel = event.value;
    console.log('ID del Nivel seleccionado:', this.selectedLevel);
  }

  deactivateJobTitle(jobTitleID: number) {
    const jobTitle = this.jobtitles.find((jt) => jt.JobTitleID === jobTitleID);

    if (!jobTitle) {
      console.error('Puesto de trabajo no encontrado');
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de desactivar el puesto: ${jobTitle.Title}?`,
      header: 'Confirmar Desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletedBy = this.loggedUserId;

        console.log(jobTitleID, deletedBy);

        this.jobTitleService
          .deactivateJobTitle(jobTitleID)
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

  editJobTitle(jobTitle: any) {
    this.jobTitle = { ...jobTitle };
    this.jobTitleEditDialog = true;
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

  hideDialog() {
    this.jobTitleDialog = false;
    this.submitted = false;
  }

  hideEditDialog() {
    this.jobTitleEditDialog = false;
    this.submitted = false;
  }

  saveJobTitle() {
    this.submitted = true;

    if (this.jobTitle.Title?.trim() && this.jobTitle.Description?.trim()) {
      console.log(
        'Datos del puesto de trabajo antes de guardar:',
        this.jobTitle
      );

      if (this.jobTitle.JobTitleID) {
        this.jobTitleService
          .updateJobTitle(this.jobTitle.JobTitleID, {
            Title: this.jobTitle.Title,
            Description: this.jobTitle.Description,
          })
          .subscribe(() => {
            const index = this.findIndexById(this.jobTitle.JobTitleID);
            if (index !== -1) {
              this.jobtitles[index] = { ...this.jobTitle };
            }

            this.jobTitleEditDialog = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Puesto Laboral Actualizado.',
              life: 3000,
            });
            this.jobTitleDialog = false;
            this.jobTitle = {};
          });
      } else {
        this.jobTitleService
          .postJobTitle(this.jobTitle)
          .subscribe((newJobTitle) => {
            this.jobtitles.push(newJobTitle);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Puesto Laboral Creado.',
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
