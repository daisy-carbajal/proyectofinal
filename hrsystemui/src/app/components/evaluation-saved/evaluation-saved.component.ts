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
    ConfirmDialogModule
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

  constructor(
    private evaluationSavedService: EvaluationSavedService,
    private evaluationTypeService: EvaluationTypeService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadEvaluations();
    this.loadEvaluationTypes();
    this.loadDepartments();
  }

  loadEvaluations() {
    this.evaluationSavedService.getAllEvaluationSaved().subscribe((data) => {
      this.evaluations = data;
    });
  }

  loadEvaluationTypes() {
    this.evaluationTypeService.getAllEvaluationTypes().subscribe((data) => {
      this.evaluationTypes = data;
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((data) => {
      this.departments = data;
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
    this.evaluation.Parameters.push({ Name: '', Weight: null });
  }

  removeParameter(index: number) {
    this.evaluation.Parameters.splice(index, 1);
  }

  saveEvaluation() {
    if (
      this.evaluation.Name &&
      this.evaluation.TypeID &&
      this.evaluation.DepartmentID
    ) {
      this.evaluationSavedService
        .postEvaluationSaved(this.evaluation)
        .subscribe((response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evaluación guardada correctamente.',
          });
          this.loadEvaluations();
          this.evaluationDialog = false;
        });
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

  editEvaluation(evaluation: any) {
    this.evaluation = { ...evaluation };
    this.evaluationDialog = true;
  }

  deleteEvaluation(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta evaluación?',
      accept: () => {
        this.evaluationSavedService.deleteEvaluationSaved(id).subscribe(() => {
          this.loadEvaluations();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evaluación eliminada correctamente.',
          });
        });
      },
    });
  }
}
