import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Evaluation360Service } from '../../services/evaluation360.service';
import { EvaluationSavedService } from '../../services/evaluation-saved.service';
import { UserService } from '../../services/user.service';
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
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';

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
    ToastModule,
    CalendarModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './evaluation360-view.component.html',
  styleUrls: ['./evaluation360-view.component.css'],
})
export class Evaluation360ViewComponent implements OnInit {
  evaluations: any[] = [];
  evaluation360: any = [] = [];
  selectedEvaluation360: any[] = [];
  evaluationDialog: boolean = false;
  evaluation: any = {};
  usersInfo: any[] = [];
  departments: any[] = [];
  parameters: any[] = [];

  constructor(
    private evaluation360Service: Evaluation360Service,
    private evaluationSavedService: EvaluationSavedService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvaluations();
    this.loadUsers();
    this.loadEvaluation360();
  }

  loadEvaluation360() {
    this.evaluation360Service.getEvaluation360Details().subscribe((dataEvals) => {
      console.log('Evaluaciones 360:', dataEvals);
      this.evaluation360 = dataEvals;
    });
  }

  loadEvaluations() {
    this.evaluationSavedService.getAllEvaluationSaved().subscribe((data) => {
      console.log('Evaluaciones:', data);
      this.evaluations = data;
    });
  }

  loadUsers() {
    this.userService.getUsersFiltered().subscribe((dataUser) => {
      this.usersInfo = dataUser;
      console.log('Evaluaciones Tipo:', this.usersInfo);
    });
  }

  goToEvaluation360List(EvaluationID: number): void {
    console.log('Navigating to List of Evaluations with ID:', EvaluationID);
    this.router.navigate(['/home/evaluation/eval360/list', EvaluationID], {
      replaceUrl: true,
    });
  }

  openNew() {
    this.evaluation = {
      EvaluateeUserID: null,
      DateCreated: null,
      DateToReview: null,
      EvaluationSavedID: null,
      Evaluators: [],
    };
    this.evaluationDialog = true;
  }

  addUser() {
    this.evaluation.Evaluators.push({
      EvaluatorUserID: null
    });
  }

  removeUser(index: number) {
    this.evaluation.Evaluators.splice(index, 1);
  }

  saveEvaluation() {
    if (
      this.evaluation.EvaluateeUserID &&
      this.evaluation.EvaluationSavedID &&
      this.evaluation.DateCreated &&
      this.evaluation.DateToReview &&
      this.evaluation.Evaluators.length > 0
    ) {
      const evaluation360 = {
        EvaluateeUserID: this.evaluation.EvaluateeUserID,
        Comments: this.evaluation.Comments || '',
        DateCreated: this.evaluation.DateCreated,
        DateToReview: this.evaluation.DateToReview,
        EvaluationSavedID: this.evaluation.EvaluationSavedID,
        Evaluators: this.evaluation.Evaluators.map((evaluator: any) => ({
          EvaluatorUserID: evaluator.EvaluatorUserID,
        })),
      };

      console.log("Datos enviados:", evaluation360);
  
      this.evaluation360Service.createEvaluation360(evaluation360).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evaluación 360 creada exitosamente.',
          });
          this.loadEvaluation360();
          this.evaluationDialog = false;
        },
        (error) => {
          console.error('Error al crear Evaluación 360:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la Evaluación 360.',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos y agregue evaluadores.',
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
}