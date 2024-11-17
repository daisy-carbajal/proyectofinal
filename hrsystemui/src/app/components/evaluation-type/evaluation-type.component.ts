import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EvaluationTypeService } from '../../services/evaluation-type.service';
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
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-evaluation-type',
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
  providers: [MessageService, ConfirmationService, EvaluationTypeService],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './evaluation-type.component.html',
  styleUrl: './evaluation-type.component.css'
})
export class EvaluationTypeComponent implements OnInit {
  evaluationTypes: any[] = [];
  selectedEvaluationTypes: any[] = [];
  evaluationTypeDialog: boolean = false;
  evaluationType: any = {};
  submitted: boolean = false;
  loggedUserId: number | null = null;

  constructor(
    private evaluationTypeService: EvaluationTypeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.evaluationTypeService.getAllEvaluationTypes().subscribe((data: any[]) => {
      this.evaluationTypes = data;
    });
    this.loggedUserId = this.authService.getUserId();
  }

  openNew() {
    this.evaluationType = {
      Name: '',
      Description: '',
      CreatedBy: this.loggedUserId,
    };
    this.submitted = false;
    this.evaluationTypeDialog = true;
  }

  editEvaluationType(evaluationType: any) {
    this.evaluationType = { ...evaluationType };
    this.evaluationTypeDialog = true;
  }

  deleteEvaluationType(evaluationTypeId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este tipo de evaluación?',
      accept: () => {
        this.evaluationTypeService.deleteEvaluationType(evaluationTypeId).subscribe(() => {
          this.evaluationTypes = this.evaluationTypes.filter((type) => type.EvaluationTypeID !== evaluationTypeId);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de evaluación eliminado', life: 3000 });
        });
      }
    });
  }

  deactivateEvaluationType(evaluationType: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea desactivar este tipo de evaluación?',
      accept: () => {
        this.evaluationTypeService.deactivateEvaluationType(evaluationType.EvaluationTypeID, this.loggedUserId).subscribe(() => {
          evaluationType.Status = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de evaluación desactivado', life: 3000 });
        });
      }
    });
  }

  hideDialog() {
    this.evaluationTypeDialog = false;
    this.submitted = false;
  }

  saveEvaluationType() {
    this.submitted = true;

    if (this.evaluationType.Name?.trim()) {
      if (this.evaluationType.EvaluationTypeID) {
        this.evaluationTypeService.updateEvaluationType(this.evaluationType.EvaluationTypeID, this.evaluationType).subscribe(() => {
          const index = this.evaluationTypes.findIndex((type) => type.EvaluationTypeID === this.evaluationType.EvaluationTypeID);
          this.evaluationTypes[index] = this.evaluationType;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de evaluación actualizado', life: 3000 });
        });
      } else {
        this.evaluationTypeService.postEvaluationType(this.evaluationType).subscribe((newType) => {
          this.evaluationTypes.push(newType);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de evaluación creado', life: 3000 });
        });
      }

      this.evaluationTypes = [...this.evaluationTypes];
      this.evaluationTypeDialog = false;
      this.evaluationType = {};
    }
  }
}
