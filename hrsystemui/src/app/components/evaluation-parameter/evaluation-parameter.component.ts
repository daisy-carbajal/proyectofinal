import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { EvaluationParameterService } from '../../services/evaluation-parameter.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-evaluation-parameter',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    EvaluationParameterService,
  ],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './evaluation-parameter.component.html',
  styleUrl: './evaluation-parameter.component.css'
})
export class EvaluationParameterComponent implements OnInit {
  evaluationParameters: any[] = [];
  selectedParameters: any[] = [];
  parameterDialog: boolean = false;
  parameter: any = {};
  submitted: boolean = false;
  loggedUserId: number | null = null;

  constructor(
    private parameterService: EvaluationParameterService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.parameterService.getAllEvaluationParameters().subscribe((data: any[]) => {
      this.evaluationParameters = data;
    });
    this.loggedUserId = this.authService.getUserId();
  }

  openNew() {
    this.parameter = {
      Description: '',
      CreatedBy: this.loggedUserId,
    };
    this.submitted = false;
    this.parameterDialog = true;
  }

  editParameter(parameter: any) {
    this.parameter = { ...parameter };
    this.parameterDialog = true;
  }

  deleteParameter(parameterId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este parámetro?',
      accept: () => {
        this.parameterService.deleteEvaluationParameter(parameterId).subscribe(
          () => {
            this.evaluationParameters = this.evaluationParameters.filter(
              (p) => p.EvaluationParameterID !== parameterId
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Parámetro eliminado',
              life: 3000,
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el parámetro',
              life: 3000,
            });
          }
        );
      },
    });
  }

  deactivateParameter(parameter: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea desactivar este parámetro?',
      accept: () => {
        const deletedBy = this.loggedUserId;
        this.parameterService.deactivateEvaluationParameter(parameter.EvaluationParameterID, deletedBy).subscribe(() => {
          parameter.Status = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Parámetro desactivado',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.parameterDialog = false;
    this.submitted = false;
  }

  saveParameter() {
    this.submitted = true;
    if (this.parameter.Description?.trim()) {
      if (this.parameter.EvaluationParameterID) {
        this.parameterService.updateEvaluationParameter(this.parameter.EvaluationParameterID, this.parameter).subscribe(() => {
          const index = this.evaluationParameters.findIndex(
            (p) => p.EvaluationParameterID === this.parameter.EvaluationParameterID
          );
          this.evaluationParameters[index] = this.parameter;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Parámetro actualizado',
            life: 3000,
          });
        });
      } else {
        this.parameterService.postEvaluationParameter(this.parameter).subscribe((newParameter) => {
          this.evaluationParameters.push(newParameter);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Parámetro creado',
            life: 3000,
          });
        });
      }
      this.evaluationParameters = [...this.evaluationParameters];
      this.parameterDialog = false;
      this.parameter = {};
    }
  }
}