import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EvaluationSavedService } from '../../services/evaluation-saved.service';
import { EvaluationTypeService } from '../../services/evaluation-type.service';
import { DepartmentService } from '../../services/department.service';
import { EvaluationParameterService } from '../../services/evaluation-parameter.service';
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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-saved-detail-view',
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './evaluation-saved-detail-view.component.html',
  styleUrl: './evaluation-saved-detail-view.component.css',
})
export class EvaluationSavedDetailViewComponent implements OnInit {
  evaluations: any[] = [];
  selectedEvaluations: any[] = [];
  evaluationDialog: boolean = false;
  evaluation: any[] = [];
  evaluationSaved: any = {};
  evaluationTypes: any[] = [];
  departments: any[] = [];
  parameters: any[] = [];
  parametersMarkedForDeletion: any[] = [];
  evaluationDetails: any = {};

  constructor(
    private evaluationSavedService: EvaluationSavedService,
    private evaluationTypeService: EvaluationTypeService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private parameterService: EvaluationParameterService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const evaluationId = params['id'];
      if (evaluationId) {
        this.loadEvaluationById(evaluationId); // Cargar la evaluación específica
      }
    });

    this.loadEvaluationTypes();
    this.loadDepartments();
    this.loadParameters();
  }

  goBackToEvaluations(): void {
    this.router.navigate(['/home/evaluation/saved']);
  }

  loadEvaluationById(id: number) {
    this.evaluationSavedService.getEvaluationSavedById(id).subscribe(
      (dataSaved) => {
        console.log('Evaluación Cargada:', dataSaved);
        this.evaluationSaved = dataSaved;
        if (!this.evaluationSaved.Parameters) {
          this.evaluationSaved.Parameters = [];
        }
        this.parametersMarkedForDeletion = [];
        console.log('Evaluation ID:', this.evaluationSaved.EvaluationID);
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

  trackByParameter(index: number, parameter: any): number {
    return parameter.EvaluationParameterID || index;
  }

  addParameter() {
    this.evaluationSaved.Parameters.push({
      Name: '',
      Weight: null,
      ParameterID: null,
    });
  }

  removeParameter(index: number) {
    const parameterToRemove = this.evaluationSaved.Parameters[index];
    if (parameterToRemove.EvaluationParameterID) {
      this.parametersMarkedForDeletion.push(
        parameterToRemove.EvaluationParameterID
      );
    }
    this.evaluationSaved.Parameters.splice(index, 1);
  }

  updateEvaluation() {
    const parametersToDelete = this.evaluationSaved.Parameters.filter(
      (param: { EvaluationParameterID: null }) =>
        param.EvaluationParameterID === null
    ).map((param: { ParameterID: any }) => param.ParameterID);

    const requestBody = {
      Name: this.evaluationSaved.EvaluationName,
      TypeID: this.evaluationSaved.EvaluationTypeID,
      DepartmentID: this.evaluationSaved.DepartmentID,
      ParameterWeights: this.evaluationSaved.Parameters.map((param: any) => ({
        ParameterID: param.EvaluationParameterID,
        Weight: param.ParameterWeight,
      })),
      ParametersToDelete: this.parametersMarkedForDeletion,
    };

    // Log para verificar los datos
    console.log('Datos que se enviarán al backend:', requestBody);

    this.evaluationSavedService
      .updateEvaluationSaved(
        this.evaluationSaved.EvaluationSavedID,
        requestBody
      )
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evaluación actualizada correctamente.',
          });
          this.goBackToEvaluations();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la evaluación. Intenta nuevamente.',
          });
        }
      );
  }
}
