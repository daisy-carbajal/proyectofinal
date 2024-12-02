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
    CalendarModule
  ],
  providers: [UserService, MessageService],
  templateUrl: './new-action-plan.component.html',
  styleUrl: './new-action-plan.component.css'
})
export class NewActionPlanComponent implements OnInit {

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

  actionPlan: any = {
    AppliedByUserID: null,
    EmployeeUserID: null,
    FocusArea: '',
    StartDate: null,
    EndDate: null,
    ActionPlanStatus: null,
    Summary: '',
    Goal: '',
    SuccessArea: '',
    OpprtunityArea: '',
    Impact: '',
    RootCauseAnalysis: '',
    Strategies: '',
    Comments: '',
    Parameters: [],
    Tasks: []    
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private calificationService: EvaluationCalificationService,
    private parameterService: EvaluationParameterService,
    private messageService: MessageService,
    private actionPlanService: ActionPlanService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStatusOptions();
    this.loadParamOptions();
    this.loadCalifications();
    this.loadParameters();
    this.calculateDuration();
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

  onUserSelected(event: any) {
    this.userSelected = event.value;
    this.userId = event.value;
    console.log('ID del Usuario seleccionado:', this.userSelected);
    this.userService
      .getUserDetailsById(this.userId)
      .subscribe((dataUserDetails) => {
        console.log('Datos del usuario:', dataUserDetails);
        this.userDetails = dataUserDetails;
      });

      if(this.userSelected === null){
        this.userDetails = {
          jobTile: '',
          department: '',
        };
      }
  }

  calculateDuration() {
    if (this.actionPlan.StartDate && this.actionPlan.EndDate) {
      const start = new Date(this.actionPlan.StartDate);
      const end = new Date(this.actionPlan.EndDate);
      const timeDiff = end.getTime() - start.getTime();
      this.duration = timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 0;
    } else {
      this.duration = 0; // Si falta una fecha, la duración es 0
    }
  }

  addTask() {
    const newTask = {
      Task: '',
      FollowUpDate: null,
      Status: 'PD',
    };
    this.actionPlan.Tasks = [...this.actionPlan.Tasks, newTask];
    this.showDetallesTasks = true;
    this.cdRef.detectChanges();
  }
  
  removeTask(index: number) {
    this.actionPlan.Tasks = this.actionPlan.Tasks.filter((_: any, i: number) => i !== index);
    this.showDetallesTasks = this.actionPlan.Tasks.length > 0;
    this.cdRef.detectChanges();
  }
  
  addParameter() {
    const newParameter = {
      ParameterID: null,
      CurrentCalificationID: null,
      GoalCalificationID: null,
      GoalAcquired: null,
      GoalStatus: 'PD',
    };
    this.actionPlan.Parameters = [...this.actionPlan.Parameters, newParameter];
    this.showDetallesParameters = true;
    this.cdRef.detectChanges();
  }
  
  removeParameter(index: number) {
    this.actionPlan.Parameters = this.actionPlan.Parameters.filter((_: any, i: number) => i !== index);
    this.showDetallesParameters = this.actionPlan.Parameters.length > 0;
    this.cdRef.detectChanges();
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
    this.calificationService.getAllEvaluationCalifications()
      .subscribe((dataCalif) => {
        console.log('Calificaciones:', dataCalif);
        this.califications = dataCalif;
      });
  }

  trackByParameter(index: number, parameter: any): number {
    return parameter.EvaluationParameterID || index;
  }
  
  trackByTask(index: number, task: any): number {
    return task.id || index; // Usa una propiedad única como ID
  }

  saveActionPlan() {
    // Validar que todos los campos requeridos estén completos
    if (
      this.actionPlan.EmployeeUserID &&
      this.actionPlan.StartDate &&
      this.actionPlan.EndDate &&
      this.actionPlan.FocusArea?.trim() &&
      this.actionPlan.ActionPlanStatus &&
      this.actionPlan.Parameters.length > 0 && // Asegurarse de que haya al menos un parámetro
      this.actionPlan.Tasks.length > 0 // Asegurarse de que haya al menos una tarea
    ) {
      // Crear el objeto para guardar el plan de acción y sus detalles
      const actionPlanToSave = {
        AppliedByUserID: this.actionPlan.AppliedByUserID,
        EmployeeUserID: this.actionPlan.EmployeeUserID,
        StartDate: this.actionPlan.StartDate,
        EndDate: this.actionPlan.EndDate,
        FocusArea: this.actionPlan.FocusArea,
        ActionPlanStatus: this.actionPlan.ActionPlanStatus,
        Summary: this.actionPlan.Summary,
        Goal: this.actionPlan.Goal,
        SuccessArea: this.actionPlan.SuccessArea,
        OpportunityArea: this.actionPlan.OpportunityArea,
        Impact: this.actionPlan.Impact,
        RootCauseAnalysis: this.actionPlan.RootCauseAnalysis,
        Strategies: this.actionPlan.Strategies,
        Comments: this.actionPlan.Comments,
        Parameters: this.actionPlan.Parameters.map((param: any) => ({
          ParameterID: param.EvaluationParameterID,
          CurrentCalificationID: param.CurrentCalificationID,
          GoalCalificationID: param.GoalCalificationID,
          GoalStatus: param.GoalStatus,
        })),
        Tasks: this.actionPlan.Tasks.map((task: any) => ({
          Task: task.Task,
          FollowUpDate: task.FollowUpDate,
          TaskStatus: task.Status,
        })),
      };

      console.log("Datos enviados:", actionPlanToSave);
  
      // Llamar al servicio para guardar
      this.actionPlanService.postActionPlan(actionPlanToSave).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plan de acción y detalles guardados correctamente.',
          });
          this.resetForm(); // Limpiar el formulario después de guardar
          this.router.navigate(['home','action-plan']); // Redirigir a la lista de planes de acción
        },
        (error) => {
          console.error('Error al guardar el plan de acción:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al guardar el plan de acción.',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos.',
      });
    }
  }
  
  resetForm() {
    this.actionPlan = {
      EmployeeUserID: null,
      CreatorUserID: null,
      StartDate: null,
      EndDate: null,
      FocusArea: '',
      ActionPlanStatus: null,
      Summary: '',
      Goal: '',
      SuccessArea: '',
      OpportunityArea: '',
      Impact: '',
      RootCauseAnalysis: '',
      Comments: '',
      Parameters: [],
      Tasks: [],
    };
    this.showDetallesParameters = false;
    this.showDetallesTasks = false;
  }
  

}
