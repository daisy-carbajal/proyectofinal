import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobLevelService } from '../../services/job-level.service';
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
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-job-title-config',
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
    DropdownModule,
  ],
  providers: [MessageService, ConfirmationService, JobLevelService],
  templateUrl: './job-title-config.component.html',
  styleUrl: './job-title-config.component.css'
})
export class JobTitleConfigComponent implements OnInit {

  joblevels: any[] = [];
  selectedJobLevels: any[] = [];
  jobLevelDialog: boolean = false;
  jobLevel!: any;
  submitted: boolean = false;

  constructor(
    private jobLevelService: JobLevelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.jobLevelService.getAllJobLevels().subscribe((data: any[]) => {
      this.joblevels = data;
      console.log("Niveles de Puestos Laborales:", data)
    });
  }

  openNew() {
    this.jobLevel = {
      Name: '',
      Description: ''
    };
    this.submitted = false;
    this.jobLevelDialog = true;
  }

  deactivateJobLevel(jobLevelID: number) {
    const jobLevel = this.joblevels.find((jl) => jl.JobLevelID === jobLevelID);

    if (!jobLevel) {
      console.error('Nivel de Niveles de Puesto de trabajo no encontrado');
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de desactivar el puesto: ${jobLevel.Title}?`,
      header: 'Confirmar Desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        console.log(jobLevelID);

        this.jobLevelService
          .deactivateJobLevel(jobLevelID)
          .subscribe(() => {
            jobLevel.status = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Niveles de Puesto de trabajo desactivado.',
              life: 3000,
            });
          });
      },
    });
  }

  deleteJobLevel(JobLevelID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este puesto?'
    );
    if (confirmed) {
      this.jobLevelService.deleteJobLevel(JobLevelID).subscribe(
        (response) => {
          console.log('ID de puesto eliminado:', JobLevelID);
          console.log('Puesto eliminado exitosamente', response);

          this.joblevels = this.joblevels.filter(
            (jobLevel) => jobLevel.JobLevelID !== JobLevelID
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

  deleteSelectedJobLevels() {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar los puestos seleccionados?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteRequests = this.selectedJobLevels.map((jobLevel) =>
          this.jobLevelService.deleteJobLevel(jobLevel.JobLevelID)
        );

        Promise.all(deleteRequests).then(
          () => {
            this.joblevels = this.joblevels.filter(
              (jobLevel) => !this.selectedJobLevels.includes(jobLevel)
            );

            this.selectedJobLevels = [];

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

  editJobLevel(jobLevel: any) {
    this.jobLevel = { ...jobLevel };
    this.jobLevelDialog = true;
  }

  hideDialog() {
    this.jobLevelDialog = false;
    this.submitted = false;
  }

  saveJobLevel() {
    this.submitted = true;

    if (this.jobLevel.Name?.trim() && this.jobLevel.Description?.trim()) {
      console.log(
        'Datos del Niveles de Puesto de trabajo antes de guardar:',
        this.jobLevel
      );

      if (this.jobLevel.JobLevelID) {
        this.jobLevelService
          .updateJobLevel(this.jobLevel.JobLevelID, {
            Name: this.jobLevel.Name,
            Description: this.jobLevel.Description,
          })
          .subscribe(() => {
            const index = this.findIndexById(this.jobLevel.JobLevelID);
            if (index !== -1) {
              this.joblevels[index] = { ...this.jobLevel };
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Puesto Laboral Actualizado.',
              life: 3000,
            });
            this.jobLevelDialog = false;
            this.jobLevel = {};
          });
      } else {
        this.jobLevelService
          .postJobLevel(this.jobLevel)
          .subscribe((newJobLevel) => {
            this.joblevels.push(newJobLevel);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Puesto Laboral Creado.',
              life: 3000,
            });
            this.jobLevelDialog = false;
            this.jobLevel = {};
          });
      }
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.joblevels.length; i++) {
      if (this.joblevels[i].JobLevelID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
