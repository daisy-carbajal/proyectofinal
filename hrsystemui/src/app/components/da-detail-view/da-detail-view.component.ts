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
import { ConfirmationService, MessageService } from 'primeng/api';
import { DisciplinaryActionService } from '../../services/disciplinary-action.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

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
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [UserService, MessageService, ConfirmationService],
  templateUrl: './da-detail-view.component.html',
  styleUrl: './da-detail-view.component.css',
})
export class DaDetailViewComponent implements OnInit {
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
    firstName: '',
    lastName: '',
    jobTitle: '',
    department: '',
  };
  userId!: number;
  disciplinaryAction: any = {};
  disciplinaryActionID: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private daReasonService: DisciplinaryActionReasonService,
    private daWarningLevelService: DisciplinaryActionWarningLevelService,
    private messageService: MessageService,
    private daService: DisciplinaryActionService,
    private confirmationService: ConfirmationService
  ) {}

  da: any = {
    UserID: null,
    ReportedByUserID: null,
    DateApplied: null,
    DisciplinaryActionReasonID: null,
    WarningID: null,
    Description: '',
    ActionTaken: '',
    Tasks: [],
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.disciplinaryActionID = params.get('id');
      if (this.disciplinaryActionID) {
        this.loadDAByID(+this.disciplinaryActionID);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se encontró un ID válido en la URL.',
        });
      }
    });

    this.loadUsers();
    this.loadReasons();
    this.loadWarningLevels();
    this.loadStatusOptions();
  }

  loadDAByID(id: number) {
    this.daService.getDisciplinaryActionWithTasksByID(id).subscribe(
      (dataSaved) => {
        console.log('Acción Disciplinaria Cargada:', dataSaved);
        this.disciplinaryAction = dataSaved;
        this.onUserSelected(dataSaved.UserID);
        if (!this.disciplinaryAction.Tasks) {
          this.disciplinaryAction.Tasks = [];
        }
        if (this.disciplinaryAction.DateApplied) {
          this.disciplinaryAction.DateApplied = new Date(
            this.disciplinaryAction.DateApplied
          );
        }
        if (
          this.disciplinaryAction.Tasks &&
          this.disciplinaryAction.Tasks.length > 0
        ) {
          this.disciplinaryAction.Tasks.forEach(
            (task: { FollowUpDate: string | number | Date }) => {
              if (task.FollowUpDate) {
                task.FollowUpDate = new Date(task.FollowUpDate);
              }
            }
          );
        }
        this.cdr.detectChanges();
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

  onUserSelected(id: number) {
    this.userSelected = id;
    console.log('ID del Usuario seleccionado:', this.userSelected);
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

  onReasonSelected(event: any) {
    this.reasonSelected = event.value;
    console.log('ID del tipo seleccionado:', this.reasonSelected);
  }

  loadWarningLevels(): void {
    this.daWarningLevelService.getAllWarningLevels().subscribe(
      (dataWarning) => {
        console.log('Datos de advertencias:', dataWarning);
        this.warningLevels = dataWarning;
      },
      (error) => {
        console.error('Error al cargar tipos de advertencias:', error);
      }
    );
  }

  onWarningLevelSelected(event: any) {
    this.warningLevelSelected = event.value;
    console.log(
      'ID de la advertencia seleccionada:',
      this.warningLevelSelected
    );
  }

  goBackToDAs(): void {
    this.router.navigate(['/home/da'], { replaceUrl: true });
  }

  trackByTask(index: number, task: any): number {
    return task.TaskID || index;
  }

  updateDisciplinaryAction() {
    console.log('Se llamó a la función updateEvaluationMaster');

    if (!this.disciplinaryAction) {
      console.error(
        'No hay información de acción disciplinaria para actualizar.'
      );
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay información de acción disciplinaria disponible.',
      });
      return;
    }

    const taskDetails = Array.isArray(this.disciplinaryAction.Tasks)
      ? this.disciplinaryAction.Tasks.map((task: any) => ({
          DisciplinaryActionTaskID: task.DisciplinaryActionTaskID || null,
          Task: task.Task || null,
          FollowUpDate: task.FollowUpDate || null,
          TaskStatus: task.TaskStatus || null,
        }))
      : [];

    // Validar detalles
    if (taskDetails.length === 0) {
      console.error('No se encontraron detalles para enviar.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay detalles para enviar en la evaluación.',
      });
      return;
    }

    const requestBody = {
      DisciplinaryActionID: this.disciplinaryAction.DisciplinaryActionID,
      DisciplinaryActionReasonID:
        this.disciplinaryAction.DisciplinaryActionReasonID,
      Description: this.disciplinaryAction.Description || '',
      ActionTaken: this.disciplinaryAction.ActionTaken || '',
      Tasks: taskDetails,
    };

    console.log('Datos que se enviarán al backend:', requestBody);

    this.daService
      .updateDisciplinaryAction(this.disciplinaryActionID, requestBody)
      .subscribe(
        (response) => {
          console.log('Respuesta del backend:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Acción Discplinaria actualizada correctamente.',
            life: 3000,
          });
          this.router.navigate(['/home/da'], { replaceUrl: true });
        },
        (error) => {
          console.error('Error al actualizar la acción disciplinaria:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudo actualizar la acción disciplinaria. Intenta nuevamente.',
              life: 3000,
          });
        }
      );
  }
  
  acknowledgeDA(DisciplinaryActionID: number): void {
    console.log('Intentando aceptar acción disciplinaria');

    if (!DisciplinaryActionID) {
      console.error('ID de acción disciplinaria no proporcionado.');
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de aceptar la retroalimentación"?`,
      header: 'Confirmar Aceptación',
      icon: 'pi pi-question-circle',
      accept: () => {
        console.log('Aceptando acción disciplinaria...');
        this.daService.acknowledgeDisciplinaryAction(DisciplinaryActionID).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Acción Disciplinaria aceptada correctamente.',
              life: 3000,
            });
          },
          (error) => {
            console.error('Error al aceptar acción disciplinaria:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo aceptar la acción disciplinaria.',
              life: 3000,
            });
          }
        );
      },
      reject: () => {
        console.log(
          'El usuario canceló la aceptación de la retroalimentación.'
        );
      },
    });
  }
}
