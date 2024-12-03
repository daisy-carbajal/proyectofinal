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
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ActionPlanService } from '../../services/action-plan.service';

@Component({
  selector: 'app-action-plan-view',
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
  providers: [MessageService, ConfirmationService],
  templateUrl: './action-plan-view.component.html',
  styleUrl: './action-plan-view.component.css'
})
export class ActionPlanViewComponent {

  das: any[] = [];
  selectedDAs: any[] = [];
  da!: any;
  submitted: boolean = false;

  constructor(
    private actionPlanService: ActionPlanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.actionPlanService.getAllActionPlans().subscribe((data: any[]) => {
      console.log('Datos de Planes de Accion:', data);
      this.das = data;
    });
  }

  editDA(incident: any) {}

  deleteDA(daID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este incident?'
    );
    if (confirmed) {
      this.actionPlanService.deleteActionPlan(daID).subscribe(
        (response) => {
          console.log('ID de Acción Disciplinaria eliminado:', daID);
          console.log('Acción Disciplinaria eliminado exitosamente', response);

          this.das = this.das.filter((da) => da.daID !== daID);

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Acción Disciplinaria eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar Acción Disciplinaria', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el Acción Disciplinaria.',
            life: 3000,
          });
        }
      );
    }
  }

  deactivateDA(da: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de borrar ' + da.Reason + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Acción Disciplinaria a Desactivar:' + da.daID);

        this.actionPlanService
          .deactivateActionPlan(da.daID)

          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Acción Disciplinaria Borrada.',
              life: 3000,
            });
          });
      },
    });
  }

}