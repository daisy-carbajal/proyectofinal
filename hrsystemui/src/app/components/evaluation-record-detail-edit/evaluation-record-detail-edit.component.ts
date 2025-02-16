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
import { EvaluationSavedService } from '../../services/evaluation-saved.service';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { EvaluationParameterService } from '../../services/evaluation-parameter.service';
import { EvaluationCalificationService } from '../../services/evaluation-calification.service';
import { EvaluationMasterService } from '../../services/evaluation-master.service';

interface Evaluation {
  EvaluationID?: number;
  Parameters?: Parameter[];
}

interface Parameter {
  CalificationID: any;
  EvaluationParameterID?: number;
}

@Component({
  selector: 'app-evaluation-record-detail-edit',
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
    EditorModule,
    CalendarModule,
    DropdownModule,
  ],
  providers: [UserService, MessageService],
  templateUrl: './evaluation-record-detail-edit.component.html',
  styleUrl: './evaluation-record-detail-edit.component.css',
})
export class EvaluationRecordDetailEditComponent implements OnInit {
  users: any[] = [];
  userSelected: number | null = null;
  evaluation: Evaluation | null = null;
  evaluationSaved: any[] = [];
  evaluationInfo: any = {};
  parameters: any[] = [];
  califications: any[] = [];
  selectedCalification: any;
  dropdownClass: string = '';
  selectedEvaluateeUserID: number | null = null;
  selectedEvaluationSavedID: number | null = null;
  dateCreated: Date | null = null;
  dateToReview: Date | null = null;
  editorContent: string = '';
  showAreasAEvaluar: boolean = false;
  evaluatorUserID: number | null = null;
  evaluateeUserID: number | null = null;
  evaluationDetails: any[] = [];
  evaluationMasterID: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private evaluationSavedService: EvaluationSavedService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private parameterService: EvaluationParameterService,
    private calificationService: EvaluationCalificationService,
    private evaluationService: EvaluationMasterService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.evaluationMasterID = params.get('id'); // Extrae el ID del incidente desde la URL
      if (this.evaluationMasterID) {
        this.loadEvaluationDetails(+this.evaluationMasterID); // Convierte a número y carga los datos
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se encontró un ID válido en la URL.',
        });
      }
    });
    this.loadUsers();
    this.loadParameters();
    this.loadCalifications();
    this.loadEvaluations();
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
    console.log('ID del Usuario seleccionado:', this.userSelected);
  }

  loadEvaluations() {
    this.evaluationSavedService
      .getAllEvaluationSaved()
      .subscribe((dataEval) => {
        console.log('Evaluaciones:', dataEval);
        this.evaluationSaved = dataEval;
      });
  }

  loadEvaluationDetails(EvaluationMasterID: number) {
    this.evaluationService
      .getEvaluationMasterDetailsByID(EvaluationMasterID)
      .subscribe(
        (dataEval) => {
          console.log('Evaluación con Detalle:', dataEval);
          this.evaluationInfo = { ...dataEval };
          this.evaluationDetails = dataEval.ParametersAndCalifications || [];
          if (this.evaluationInfo.DateCreated) {
            this.evaluationInfo.DateCreated = new Date(
              this.evaluationInfo.DateCreated
            );
          }
          if (this.evaluationInfo.DateToReview) {
            this.evaluationInfo.DateToReview = new Date(
              this.evaluationInfo.DateToReview
            );
          }

          if (this.evaluationDetails.length > 0) {
            this.showAreasAEvaluar = this.evaluationDetails.length > 0;
            this.cdr.detectChanges();
          } else {
            console.warn('No se encontraron parámetros y calificaciones');
          }

          this.cdr.detectChanges(); // Forzamos actualización del DOM
        },
        (error) => {
          console.error(
            'Error al cargar los detalles de la evaluación:',
            error
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar los detalles de la evaluación.',
          });
        }
      );
  }

  trackByParameter(index: number, parameter: any): number {
    return parameter.EvaluationParameterID || index;
  }

  onEvaluationSelected(evaluationId: number) {
    this.loadEvaluationById(evaluationId);
    if (evaluationId) {
      this.showAreasAEvaluar = true;
    } else {
      this.showAreasAEvaluar = false;
    }
  }

  loadEvaluationById(id: number) {
    this.evaluationSavedService.getEvaluationSavedById(id).subscribe(
      (dataSaved: Evaluation) => {
        console.log('Evaluación Cargada:', dataSaved);
        this.evaluation = dataSaved; // Asignar el objeto a la propiedad correcta
        if (!this.evaluation.Parameters) {
          this.evaluation.Parameters = []; // Inicializar si no existen
        }
        console.log('Evaluation ID:', this.evaluation.EvaluationID);
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

  loadParameters() {
    this.parameterService.getAllEvaluationParameters().subscribe(
      (dataParam) => {
        console.log('Parámetros:', dataParam);
        this.parameters = dataParam.map(
          (param: { Name: any; EvaluationParameterID: any }) => ({
            ParameterName: param.Name, // Nombre del parámetro
            EvaluationParameterID: param.EvaluationParameterID, // ID del parámetro
          })
        );
      },
      (error) => {
        console.error('Error al cargar parámetros:', error);
      }
    );
  }

  loadCalifications() {
    this.calificationService.getAllEvaluationCalifications().subscribe(
      (dataCalif) => {
        console.log('Calificaciones:', dataCalif);
        this.califications = dataCalif.map(
          (calif: { Calification: any; EvaluationCalificationID: any }) => ({
            CalificationDescription: calif.Calification, // Descripción de la calificación
            EvaluationCalificationID: calif.EvaluationCalificationID, // ID de la calificación
          })
        );
      },
      (error) => {
        console.error('Error al cargar calificaciones:', error);
      }
    );
  }

  onParameterChange(parameter: any, index: number) {
    console.log(`Parámetro actualizado [${index}]:`, parameter);
  }

  onCalificationChange(parameter: any, index: number) {
    console.log(`Calificación actualizada [${index}]:`, parameter);
  }

  trackByCalification(index: number, calification: any): number {
    return calification.EvaluationCalificationID || index;
  }

  goBackToEvaluations(): void {
    if (this.evaluationInfo && this.evaluationInfo.Evaluation360) {
      this.router.navigate(
        ['/home/evaluation/eval360/list', this.evaluationInfo.Evaluation360ID],
        { replaceUrl: true }
      );
    } else {
      this.router.navigate(['/home/evaluation/records'], { replaceUrl: true });
    }
  }

  get totalPonderedScoreWithPercentage(): string {
    return this.evaluationInfo?.TotalPonderedScore !== undefined
      ? `${this.evaluationInfo.TotalPonderedScore} %`
      : '';
  }

  updateEvaluationMaster() {
    console.log('Se llamó a la función updateEvaluationMaster');
  
    if (!this.evaluationInfo) {
      console.error('No hay información de evaluación para actualizar.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay información de evaluación disponible.',
      });
      return;
    }
  
    const details = Array.isArray(this.evaluationInfo.ParametersAndCalifications)
      ? this.evaluationInfo.ParametersAndCalifications.map((parameter: any) => ({
          EvaluationDetailID: parameter.EvaluationDetailID || null,
          ParameterID: parameter.EvaluationParameterID || null,
          CalificationID: parameter.EvaluationCalificationID || null,
        }))
      : [];
  
    if (details.length === 0) {
      console.error('No se encontraron detalles para enviar.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay detalles para enviar en la evaluación.',
      });
      return;
    }
  
    const formattedDate = this.evaluationInfo.DateCreated
      ? new Date(this.evaluationInfo.DateCreated).toISOString()
      : null;
  
    const requestBody = {
      EvaluationMasterID: this.evaluationInfo.EvaluationMasterID,
      EvaluatorUserID: this.evaluationInfo.EvaluatorUserID,
      EvaluateeUserID: this.evaluationInfo.EvaluateeUserID,
      DateCreated: formattedDate,
      Comments: this.evaluationInfo.Comments || '',
      Details: details,
    };
  
    console.log('Datos que se enviarán al backend:', requestBody);
  
    // Enviar la solicitud al servicio
    this.evaluationService.updateEvaluationMaster(this.evaluationMasterID, requestBody)
      .subscribe(
        (response) => {
          console.log('Respuesta del backend:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evaluación actualizada correctamente.',
          });
          this.router.navigate(['/home/evaluation/records'], { replaceUrl: true });
        },
        (error) => {
          console.error('Error al actualizar la evaluación:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la evaluación. Intenta nuevamente.',
          });
        }
      );
  }

  acknowledgeEvaluationMaster() {
    const requestBody = {
      EvaluatorUserID: this.evaluationInfo.EvaluatorUserID,
      Comments: this.evaluationInfo.Comments || ''
    };

    this.evaluationService.acknowledgeEvaluationMaster(this.evaluationMasterID, requestBody)
      .subscribe(
        (response) => {
          console.log('Respuesta del backend:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evaluación aceptada correctamente.',
          });
          this.router.navigate(['/home/evaluation/records'], { replaceUrl: true });
        },
        (error) => {
          console.error('Error al aceptar la evaluación:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo aceptar la evaluación. Intenta nuevamente.',
          });
        }
      );
  }
   
}
