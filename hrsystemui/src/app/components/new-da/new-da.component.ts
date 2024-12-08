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
import { DisciplinaryActionReasonService } from '../../services/disciplinary-action-reason.service';
import { DisciplinaryActionWarningLevelService } from '../../services/disciplinary-action-warning-level.service';
import { MessageService } from 'primeng/api';
import { DisciplinaryActionService } from '../../services/disciplinary-action.service';

interface StatusOption {
  icon: string;
  name: string;
  code: string;
}

@Component({
  selector: 'app-new-da',
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
  ],
  providers: [UserService, MessageService],
  templateUrl: './new-da.component.html',
  styleUrl: './new-da.component.css',
})
export class NewDAComponent implements OnInit {
  users: any[] = [];
  userSelected: number | null = null;
  showDetalles: boolean = false;
  reasons: any[] = [];
  reasonSelected: number | null = null;
  warningLevels: any[] = [];
  warningLevelSelected: number | null = null;
  options: StatusOption[] | undefined;
  selectedOption: StatusOption | undefined;
  userDetails: any = {
    jobTitle: '',
    department: '',
  };
  userId!: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private daReasonService: DisciplinaryActionReasonService,
    private daWarningLevelService: DisciplinaryActionWarningLevelService,
    private messageService: MessageService,
    private daService: DisciplinaryActionService,
  ) {}

  da: any = {
    EmployeeUserID: null,
    ReportedByUserID: null,
    DateApplied: null,
    DisciplinaryActionReasonID: null,
    WarningID: null,
    Description: '',
    ActionTaken: '',
    Tasks: [],
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadReasons();
    this.loadStatusOptions();
  }

  loadStatusOptions(): void {
    this.options = [
      { icon: 'pi pi-thumbtack', name: 'Asignada', code: 'PD' },
      { icon: 'pi pi-spinner-dotted', name: 'En Ejecución', code: 'EJ' },
      { icon: 'pi pi-check', name: 'Completada', code: 'CP' },
      { icon: 'pi pi-times', name: 'Cancelada', code: 'CN' },
    ];
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

  addTask() {
    console.log('Agregando tarea.');
    this.da.Tasks.push({
      Task: '',
      FollowUpDate: null,
      Status: '',
    });
    this.showDetalles = true;
  }

  removeTask(index: number) {
    this.da.Tasks.splice(index, 1);

    if (this.da.Tasks.length === 0) {
      this.showDetalles = false;
    }
  }

  loadReasons(): void {
    this.daReasonService.getAllDisciplinaryActionReasons().subscribe(
      (dataReason) => {
        console.log('Datos de razones:', dataReason);
        this.reasons = dataReason;
      },
      (error) => {
        console.error('Error al cargar tipos de feedback:', error);
      }
    );
  }

  loadWarningLevels(userId?: number, reasonId?: number): void {
    if (!userId || !reasonId) {
      console.warn('No se pueden cargar niveles de advertencia: UserID o ReasonID no están definidos.');
      return; // Salir si falta alguno de los parámetros
    }
  
    this.daWarningLevelService.getWarningLevelFiltered(userId, reasonId).subscribe(
      (dataWarning) => {
        console.log('Datos de advertencias:', dataWarning);
        this.warningLevels = dataWarning;
      },
      (error) => {
        console.error('Error al cargar niveles de advertencias:', error);
      }
    );
  }
  
  onUserSelected(event: any): void {
    this.userSelected = event.value || null; // Asegurar que nunca sea undefined
    console.log('ID del Usuario seleccionado:', this.userSelected);
  
    if (this.userSelected) {
      this.userService.getUserDetailsById(this.userSelected).subscribe(
        (dataUserDetails) => {
          console.log('Datos del usuario:', dataUserDetails);
          this.userDetails = dataUserDetails;
        },
        (error) => {
          console.error('Error al cargar los detalles del usuario:', error);
        }
      );
    } else {
      this.userDetails = { jobTitle: '', department: '' };
    }
  
    this.onUserOrReasonSelected();
  }
  
  onReasonSelected(event: any): void {
    this.reasonSelected = event.value || null; // Asegurar que nunca sea undefined
    console.log('ID del tipo seleccionado:', this.reasonSelected);
  
    this.onUserOrReasonSelected();
  }
  
  onUserOrReasonSelected(): void {
    if (this.userSelected && this.reasonSelected) {
      console.log('Cargando niveles de advertencia con UserID:', this.userSelected, 'y ReasonID:', this.reasonSelected);
      this.loadWarningLevels(this.userSelected, this.reasonSelected);
    } else {
      console.log('Esperando selección de ambos valores: UserID y ReasonID.');
    }
  }

  saveDisciplinaryAction() {
    if (
      this.da.UserID &&
      this.da.ReportedBy &&
      this.da.DisciplinaryActionReasonID &&
      this.da.WarningID &&
      this.da.Description?.trim() &&
      this.da.ActionTaken?.trim() &&
      this.da.DateApplied &&
      this.da.Tasks.length > 0 // Asegurarse de que haya al menos una tarea
    ) {
      // Crear el objeto para guardar la acción disciplinaria y sus tareas
      const disciplinaryActionToSave = {
        DisciplinaryActionReasonID: this.da.DisciplinaryActionReasonID,
        UserID: this.da.UserID,
        ReportedByUserID: this.da.ReportedBy,
        WarningID: this.da.WarningID,
        Description: this.da.Description,
        ActionTaken: this.da.ActionTaken,
        DateApplied: this.da.DateApplied,
        Tasks: this.da.Tasks.map((task: any) => ({
          Task: task.Task,
          FollowUpDate: task.FollowUpDate,
          TaskStatus: task.Status,
        })),
      };
  
      // Llamar al servicio para guardar
      this.daService.postDisciplinaryAction(disciplinaryActionToSave).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Acción disciplinaria y tareas guardadas correctamente.',
          });
          this.resetForm(); 
          this.router.navigate(['home','da']);
        },
        (error) => {
          console.error('Error al guardar la acción disciplinaria:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al guardar la acción disciplinaria.',
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
    this.da = {
      EmployeeUserID: null,
      ReportedByUserID: null,
      DateApplied: null,
      DisciplinaryActionReasonID: null,
      WarningID: null,
      Description: '',
      ActionTaken: '',
      Tasks: [],
    };
    this.userDetails = {
      jobTitle: '',
      department: '',
    };
    this.showDetalles = false;
  }  
}
