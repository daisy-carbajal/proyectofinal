import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EvaluationSavedService } from '../../services/evaluation-saved.service';
import { EvaluationTypeService } from '../../services/evaluation-type.service';
import { DepartmentService } from '../../services/department.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EvaluationParameterService } from '../../services/evaluation-parameter.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-evaluation-saved',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    DropdownModule,
    ToolbarModule,
    DialogModule,
    CommonModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './evaluation-saved.component.html',
  styleUrls: ['./evaluation-saved.component.css'],
})
export class EvaluationSavedComponent implements OnInit {
  evaluations: any[] = [];
  selectedEvaluations: any[] = [];
  evaluationDialog: boolean = false;
  evaluation: any = {};
  evaluationTypes: any[] = [];
  departments: any[] = [];
  parameters: any[] = [];

  constructor(
    private evaluationSavedService: EvaluationSavedService,
    private evaluationTypeService: EvaluationTypeService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private parameterService: EvaluationParameterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvaluations();
    this.loadEvaluationTypes();
    this.loadDepartments();
    this.loadParameters();
  }

  loadEvaluations() {
    this.evaluationSavedService.getAllEvaluationSaved().subscribe((data) => {
      console.log('Evaluaciones:', data);
      this.evaluations = data;
    });
  }

  loadEvaluationTypes() {
    this.evaluationTypeService.getAllEvaluationTypes().subscribe((dataType) => {
      this.evaluationTypes = dataType;
      console.log('Evaluaciones Tipo:', this.evaluationTypes);
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((dataDepto) => {
      this.departments = dataDepto;
    });
  }

  loadParameters() {
    this.parameterService
      .getAllEvaluationParameters()
      .subscribe((dataParam) => {
        console.log('Parametros:', dataParam);
        this.parameters = dataParam;
      });
  }

  goToEvaluationSavedDetails(EvaluationID: number): void {
    console.log('Navigating to Evaluation ID:', EvaluationID);
    this.router.navigate(['/home/evaluation/saved', EvaluationID], {
      replaceUrl: true,
    });
  }

  openNew() {
    this.evaluation = {
      Name: '',
      TypeID: null,
      DepartmentID: null,
      Parameters: [],
    };
    this.evaluationDialog = true;
  }

  addParameter() {
    this.evaluation.Parameters.push({
      Name: '',
      Weight: null,
      ParameterID: null,
    });
  }

  removeParameter(index: number) {
    this.evaluation.Parameters.splice(index, 1);
  }

  saveEvaluation() {
    if (
      this.evaluation.Name &&
      this.evaluation.TypeID &&
      this.evaluation.DepartmentID &&
      this.evaluation.Parameters.length > 0
    ) {
      const evaluationToSave = {
        Name: this.evaluation.Name,
        TypeID: this.evaluation.TypeID,
        DepartmentID: this.evaluation.DepartmentID,
        ParameterWeights: this.evaluation.Parameters.map(
          (param: { ParameterID: any; Weight: any }) => ({
            ParameterID: param.ParameterID,
            Weight: param.Weight,
          })
        ),
      };

      this.evaluationSavedService
        .postEvaluationSaved(evaluationToSave)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evaluación y parámetros guardados correctamente.',
            });
            this.loadEvaluations();
            this.evaluationDialog = false;
          },
          (error) => {
            if (
              error.error?.message?.includes(
                'La suma total de los pesos debe ser exactamente 100.'
              )
            ) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error de Validación',
                detail:
                  'La suma total de los pesos debe ser exactamente 100. Revisa los pesos de los parámetros.',
              });
            } else if (
              error.error?.message?.includes(
                'La suma total de los pesos no puede exceder 100.'
              )
            ) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error de Validación',
                detail:
                  'La suma total de los pesos no puede exceder 100. Revisa los pesos de los parámetros.',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al guardar la evaluación.',
              });
            }
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

  hideDialog() {
    this.evaluationDialog = false;
  }

  deleteEvaluation(evaluation: any) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar esta evaluación?'
    );
    if (confirmed) {
      this.evaluationSavedService
        .deleteEvaluationSaved(evaluation.EvaluationSavedID)
        .subscribe(
          (response) => {
            console.log(
              'ID de evaluación eliminada:',
              evaluation.EvaluationSavedID
            );
            console.log('Evaluación eliminada exitosamente', response);

            this.loadEvaluations();

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evaluación eliminada correctamente.',
            });
          },
          (error) => {
            console.error('Error al eliminar evaluación', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al eliminar la evaluación.',
            });
          }
        );
    }
  }

  getFilteredParameters(index: number): any[] {
    const selectedParameterIDs = this.evaluation.Parameters.map(
      (param: { EvaluationParameterID: any }) => param.EvaluationParameterID
    ).filter((id: null) => id !== null); // Filtra valores no nulos

    return this.parameters.filter(
      (param) =>
        !selectedParameterIDs.includes(param.EvaluationParameterID) || // Incluir opciones no seleccionadas
        this.evaluation.Parameters[index]?.EvaluationParameterID ===
          param.EvaluationParameterID // Incluir el actual
    );
  }
}
