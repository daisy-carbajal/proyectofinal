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
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';
import { EvaluationCalificationService } from '../../services/evaluation-calification.service';
import { EvaluationParameterService } from '../../services/evaluation-parameter.service';
import { MessageService } from 'primeng/api';
import { ActionPlanService } from '../../services/action-plan.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface StatusOption {
  icon: string;
  name: string;
  code: string;
}

@Component({
  selector: 'app-new-action-plan',
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
    DropdownModule,
    EditorModule,
    CalendarModule,
    ConfirmDialogModule
  ],
  providers: [UserService, MessageService, ConfirmationService],
  templateUrl: './action-plan-detail-view.component.html',
  styleUrl: './action-plan-detail-view.component.css',
})
export class ActionPlanDetailViewComponent implements OnInit {
  users: any[] = [];
  userSelected: number | null = null;
  showDetallesTasks: boolean = false;
  showDetallesParameters: boolean = false;
  options: StatusOption[] | undefined;
  selectedOption: StatusOption | undefined;
  paramOptions: StatusOption[] | undefined;
  paramSelectedOption: StatusOption | undefined;
  parameters: any[] = [];
  califications: any[] = [];
  userDetails: any = {
    jobTitle: '',
    department: '',
  };
  userId!: number;
  duration!: number;

  actionPlanInfo: any = {};
  actionPlanID: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private calificationService: EvaluationCalificationService,
    private parameterService: EvaluationParameterService,
    private messageService: MessageService,
    private actionPlanService: ActionPlanService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.actionPlanID = params.get('id');
      if (this.actionPlanID) {
        this.loadActionPlanByID(+this.actionPlanID);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se encontró un ID válido en la URL.',
        });
      }
    });

    this.loadUsers();
    this.loadStatusOptions();
    this.loadParamOptions();
    this.loadCalifications();
    this.loadParameters();
  }

  loadActionPlanByID(id: number) {
    this.actionPlanService.getActionPlanDetailsByID(id).subscribe(
      (dataSaved) => {
        console.log('Plan de Mejora Cargad:', dataSaved);
        this.actionPlanInfo = dataSaved;
        this.onUserSelected(dataSaved.EmployeeUserID);
        if (!this.actionPlanInfo.Tasks) {
          this.actionPlanInfo.Tasks = [];
        }
        if (this.actionPlanInfo.StartDate && this.actionPlanInfo.EndDate) {
          this.actionPlanInfo.StartDate = new Date(
            this.actionPlanInfo.StartDate
          );
          this.actionPlanInfo.EndDate = new Date(this.actionPlanInfo.EndDate);
          this.calculateDuration(
            this.actionPlanInfo.StartDate,
            this.actionPlanInfo.EndDate
          );
        }
        if (this.actionPlanInfo.Tasks && this.actionPlanInfo.Tasks.length > 0) {
          this.actionPlanInfo.Tasks.forEach(
            (task: { FollowUpDate: string | number | Date }) => {
              if (task.FollowUpDate) {
                task.FollowUpDate = new Date(task.FollowUpDate);
              }
            }
          );
        }
        this.cdRef.detectChanges();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la evaluación.',
        });
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (dataUser) => {
        console.log('Datos de usuaros:', dataUser);
        this.users = dataUser;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  onUserSelected(id: any) {
    this.userService.getUserDetailsById(id).subscribe((dataUserDetails) => {
      console.log('Datos del usuario:', dataUserDetails);
      this.userDetails = dataUserDetails;
    });

    if (this.userSelected === null) {
      this.userDetails = {
        jobTile: '',
        department: '',
      };
    }
  }

  calculateDuration(start: Date, end: Date): void {
    if (this.actionPlanInfo.StartDate && this.actionPlanInfo.EndDate) {
      start = this.actionPlanInfo.StartDate;
      end = this.actionPlanInfo.EndDate;

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const timeDiff = end.getTime() - start.getTime();
        this.duration =
          timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 0;
      } else {
        console.error('Fechas inválidas: StartDate o EndDate no son válidas.');
        this.duration = 0;
      }
    } else {
      this.duration = 0;
    }
  }

  loadStatusOptions(): void {
    this.options = [
      { icon: 'pi pi-thumbtack', name: 'Asignada', code: 'PD' },
      { icon: 'pi pi-spinner-dotted', name: 'En Ejecución', code: 'EJ' },
      { icon: 'pi pi-check', name: 'Completada', code: 'CP' },
      { icon: 'pi pi-times', name: 'Cancelada', code: 'CN' },
    ];
  }

  loadParamOptions(): void {
    this.paramOptions = [
      { icon: 'pi pi-clock', name: 'Pendiente', code: 'PD' },
      { icon: 'pi pi-spinner-dotted', name: 'En Proceso', code: 'EP' },
      { icon: 'pi pi-star-half', name: 'Parcialmente Alcanzado', code: 'CP' },
      { icon: 'pi pi-check', name: 'Alcanzado', code: 'AL' },
      { icon: 'pi pi-star-fill', name: 'Excedido', code: 'EX' },
      { icon: 'pi pi-ban', name: 'No Aplicable', code: 'NA' },
    ];
  }

  loadParameters() {
    this.parameterService
      .getAllEvaluationParameters()
      .subscribe((dataParam) => {
        console.log('Parametros:', dataParam);
        this.parameters = dataParam;
      });
  }

  loadCalifications() {
    this.calificationService
      .getAllEvaluationCalifications()
      .subscribe((dataCalif) => {
        console.log('Calificaciones:', dataCalif);
        this.califications = dataCalif;
      });
  }

  trackByParameter(index: number, parameter: any): number {
    return parameter.ActionPlanParameterID || index;
  }

  trackByTask(index: number, task: any): number {
    return task.id || index;
  }

  goBackToActionPlans(): void {
    this.router.navigate(['/home/action-plan'], { replaceUrl: true });
  }

  updateActionPlan() {
    console.log('Se llamó a la función updateActionPlan');

    if (!this.actionPlanInfo) {
      console.error('No hay información de plan de acción para actualizar.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay información de plan de acción disponible.',
      });
      return;
    }

    const taskDetails = Array.isArray(this.actionPlanInfo.Tasks)
      ? this.actionPlanInfo.Tasks.map((task: any) => ({
          TaskID: task.ActionPlanTaskID || null,
          Task: task.Task || null,
          FollowUpDate: task.FollowUpDate || null,
          TaskStatus: task.TaskStatus || null,
        }))
      : [];

    if (taskDetails.length === 0) {
      console.error('No se encontraron detalles de tareas para enviar.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay detalles de tareas para enviar en la evaluación.',
      });
      return;
    }

    const parameterDetails = Array.isArray(this.actionPlanInfo.Parameters)
      ? this.actionPlanInfo.Parameters.map((parameter: any) => ({
          ParameterID: parameter.ParameterID || null,
          GoalCalificationID: parameter.GoalCalificationID || null,
          GoalStatus: parameter.GoalStatus || null,
        }))
      : [];

    if (parameterDetails.length === 0) {
      console.error('No se encontraron detalles deparametros para enviar.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay detalles de parametros para enviar en la evaluación.',
      });
      return;
    }

    const requestBody = {
      ActionPlanID: this.actionPlanInfo.ActionPlanID,
      Summary: this.actionPlanInfo.Summary,
      Goal: this.actionPlanInfo.Goal,
      SuccessArea: this.actionPlanInfo.SuccessArea,
      OpportunityArea: this.actionPlanInfo.OpportunityArea,
      Impact: this.actionPlanInfo.Impact,
      RootCauseAnalysis: this.actionPlanInfo.RootCauseAnalysis,
      EndDate: this.actionPlanInfo.EndDate,
      ActionPlanStatus: this.actionPlanInfo.ActionPlanStatus,
      Strategies: this.actionPlanInfo.Strategies || '',
      Comments: this.actionPlanInfo.Comments || '',
      Parameters: parameterDetails,
      Tasks: taskDetails,
    };

    console.log('Datos que se enviarán al backend:', requestBody);

    this.actionPlanService
      .updateActionPlan(this.actionPlanID, requestBody)
      .subscribe(
        (response) => {
          console.log('Respuesta del backend:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plan de Acción actualizado correctamente.',
            life: 3000,
            sticky: true
          });
          this.router.navigate(['/home/action-plan'], { replaceUrl: true });
        },
        (error) => {
          console.error('Error al actualizar la plan de mejora:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudo actualizar el plan de mejora. Intenta nuevamente.',
            life: 3000,
            sticky: true
          });
        }
      );
  }

  acknowledgeActionPlan(ActionPlanID: number): void {
    console.log('Intentando aceptar plan de mejora');

    if (!ActionPlanID) {
      console.error('ID de acción disciplinaria no proporcionado.');
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de aceptar el plan de mejora"?`,
      header: 'Confirmar Aceptación',
      icon: 'pi pi-question-circle',
      accept: () => {
        console.log('Aceptando acción disciplinaria...');
        this.actionPlanService.acknowledgeActionPlan(ActionPlanID).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Plan de Mejora aceptado correctamente.',
              life: 3000,
              sticky: true
            });
          },
          (error) => {
            console.error('Error al aceptar plan de mejora:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo aceptar plan de mejora.',
              life: 3000,
              sticky: true
            });
          }
        );
      },
      reject: () => {
        console.log(
          'El usuario canceló la aceptación del plan de mejora.'
        );
      },
    });
  }
}
