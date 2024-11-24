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
  selectedDate: Date | null = null;
  editorContent: string = '';
  showAreasAEvaluar: boolean = false;
  evaluatorUserID: number | null = null;
  evaluateeUserID: number | null = null;
  evaluationDetails: any[] = [];

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
      const evalMasterID = params.get('id'); // Extrae el ID del incidente desde la URL
      if (evalMasterID) {
        this.loadEvaluationDetails(+evalMasterID); // Convierte a número y carga los datos
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
    this.evaluationService.getEvaluationMasterDetailsByID(EvaluationMasterID).subscribe(
      (dataEval) => {
        console.log('Evaluación con Detalle:', dataEval);
        this.evaluationInfo = { ...dataEval }; // Copiamos los datos de la evaluación
        this.evaluationDetails = dataEval.ParametersAndCalifications || []; // Asignamos los parámetros y calificaciones
        if (this.evaluationInfo.DateCreated) {
          this.evaluationInfo.DateCreated = new Date(this.evaluationInfo.DateCreated);
        }
        // Activa la vista de parámetros si existen
        if (this.evaluationDetails.length > 0) {
          this.showAreasAEvaluar = this.evaluationDetails.length > 0; 
          this.cdr.detectChanges();
        } else {
          console.warn('No se encontraron parámetros y calificaciones');
        }
  
        this.cdr.detectChanges(); // Forzamos actualización del DOM
      },
      (error) => {
        console.error('Error al cargar los detalles de la evaluación:', error);
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
        this.parameters = dataParam.map((param: { Name: any; EvaluationParameterID: any; }) => ({
          ParameterName: param.Name, // Nombre del parámetro
          EvaluationParameterID: param.EvaluationParameterID // ID del parámetro
        }));
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
        this.califications = dataCalif.map((calif: { Calification: any; EvaluationCalificationID: any; }) => ({
          CalificationDescription: calif.Calification, // Descripción de la calificación
          EvaluationCalificationID: calif.EvaluationCalificationID // ID de la calificación
        }));
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
    this.router.navigate(['/home/evaluation/records'], { replaceUrl: true });
  }

  get totalPonderedScoreWithPercentage(): string {
    return this.evaluationInfo?.TotalPonderedScore !== undefined
      ? `${this.evaluationInfo.TotalPonderedScore} %`
      : '';
  }

  saveEvaluation(): void {
    if (
      !this.evaluatorUserID ||
      !this.evaluateeUserID ||
      !this.selectedEvaluationSavedID ||
      !this.selectedDate
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos.',
      });
      return;
    }

    const details =
      this.evaluation?.Parameters?.map((parameter) => ({
        ParameterID: parameter.EvaluationParameterID,
        CalificationID: parameter.CalificationID,
      })) || [];

    const formattedDate = this.selectedDate?.toISOString();

    const evaluationMaster = {
      EvaluatorUserID: this.evaluatorUserID,
      EvaluateeUserID: this.evaluateeUserID,
      EvaluationSavedID: this.selectedEvaluationSavedID,
      DateCreated: formattedDate,
      Comments: this.editorContent,
      Details: details,
    };

    console.log('Datos Enviados:', evaluationMaster);

    this.evaluationService.postEvaluationMaster(evaluationMaster).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
        });
        this.clearForm();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la evaluación.',
        });
      }
    );
  }

  clearForm() {
    this.evaluatorUserID = null;
    this.evaluateeUserID = null;
    this.selectedEvaluationSavedID = null;
    this.selectedDate = null;
    this.editorContent = '';
    this.evaluationDetails = [];
    this.evaluation = null;
    this.userSelected = null;
    this.selectedEvaluateeUserID = null;
  }
}
