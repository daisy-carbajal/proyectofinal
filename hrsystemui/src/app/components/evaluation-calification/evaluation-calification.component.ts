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
import { EvaluationCalificationService } from '../../services/evaluation-calification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-evaluation-calification',
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
    InputNumberModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    EvaluationCalificationService,
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
  templateUrl: './evaluation-calification.component.html',
  styleUrl: './evaluation-calification.component.css',
})
export class EvaluationCalificationComponent implements OnInit {
  califications: any[] = [];
  selectedCalifications: any[] = [];
  calificationDialog: boolean = false;
  calification: any = {};
  submitted: boolean = false;
  loggedUserId: number | null = null;

  constructor(
    private calificationService: EvaluationCalificationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.calificationService
      .getAllEvaluationCalifications()
      .subscribe((data: any[]) => {
        this.califications = data;
      });
    this.loggedUserId = this.authService.getUserId();
  }

  openNew() {
    this.calification = {
      Value: 0,
      Description: '',
      Summary: '',
      CreatedBy: this.loggedUserId,
    };
    this.submitted = false;
    this.calificationDialog = true;
  }

  editCalification(calification: any) {
    this.calification = { ...calification };
    this.calificationDialog = true;
  }

  deleteCalification(calificationId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar esta calificación?',
      accept: () => {
        this.calificationService
          .deleteEvaluationCalification(calificationId)
          .subscribe(
            () => {
              this.califications = this.califications.filter(
                (c) => c.EvaluationCalificationID !== calificationId
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Calificación eliminada',
                life: 3000,
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar la calificación',
                life: 3000,
              });
            }
          );
      },
    });
  }

  deactivateCalification(calification: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea desactivar esta calificación?',
      accept: () => {
        const deletedBy = this.loggedUserId;
        this.calificationService
          .deactivateEvaluationCalification(
            calification.EvaluationCalificationID,
            deletedBy
          )
          .subscribe(() => {
            calification.Status = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Calificación desactivada',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.calificationDialog = false;
    this.submitted = false;
  }

  saveCalification() {
    this.submitted = true;
    if (this.calification.Description?.trim()) {
      if (this.calification.EvaluationCalificationID) {
        this.calificationService
          .updateEvaluationCalification(
            this.calification.EvaluationCalificationID,
            this.calification
          )
          .subscribe(() => {
            const index = this.califications.findIndex(
              (c) =>
                c.EvaluationCalificationID ===
                this.calification.EvaluationCalificationID
            );
            this.califications[index] = this.calification;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Calificación actualizada',
              life: 3000,
            });
          });
      } else {
        this.calificationService
          .postEvaluationCalification(this.calification)
          .subscribe((newCalification) => {
            this.califications.push(newCalification);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Calificación creada',
              life: 3000,
            });
          });
      }
      this.califications = [...this.califications];
      this.calificationDialog = false;
      this.calification = {};
    }
  }
}
