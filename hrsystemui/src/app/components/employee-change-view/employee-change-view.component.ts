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
import { AuthService } from '../../services/auth.service';
import { TreeTableModule } from 'primeng/treetable';
import { Router } from '@angular/router';
import { JobtitleChangeService } from '../../services/job-title-change.service';

@Component({
  selector: 'app-employee-change-view',
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
    TreeTableModule,
  ],
  providers: [MessageService, ConfirmationService, JobtitleChangeService],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './employee-change-view.component.html',
  styleUrl: './employee-change-view.component.css',
})
export class EmployeeChangeViewComponent implements OnInit {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  pendingChanges: any[] = [];
  selectedPendingChanges: any[] = [];
  pendingChange!: any;
  submitted: boolean = false;
  loggedUserId: number | null = null;

  constructor(
    private router: Router,
    private jobTitleChangeService: JobtitleChangeService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.jobTitleChangeService.getPendingChanges().subscribe({
      next: (data: any[]) => {
        this.pendingChanges = data.map((change) => ({
          ...change,
          UserName: change.UserName || 'No definido',
          DepartmentName: change.DepartmentName || 'No definido',
          JobTitle: change.JobTitleTitle || 'No definido',
          StartDate: change.JobTitleChangeStartDate
            ? new Date(change.JobTitleChangeStartDate)
            : null,
          JobTitleID: change.JobTitleID || 0,
          UserID: change.UserID || 0,
          ChangeReason: change.JobTitleChangeReason
        }));
        console.log('Pending Changes:', this.pendingChanges);
      },
      error: (err) => {
        console.error('Error al obtener los cambios pendientes:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los cambios pendientes.',
        });
      },
    });
    this.loggedUserId = this.authService.getUserId();
  }

  goToRoleDetails(roleId: number): void {
    console.log('Navigating to role ID:', roleId);
    this.router.navigate(['/home/roles', roleId], { replaceUrl: true });
  }

  goToPendingChangesDetails(userId: number): void {
    console.log('Navigating to user ID:', userId);
    this.router.navigate(['/home/user/change', userId], { replaceUrl: true });
  }

  approveChange(pendingChange: any) {
    const infoChange = {
      DepartmentChangeID: pendingChange.DepartmentChangeID,
      JobTitleChangeID: pendingChange.JobTitleChangeID,
      UserID: pendingChange.UserID,
    };

    console.log('Datos Enviados para aprobación:', JSON.stringify(infoChange));

    this.jobTitleChangeService
      .approveChanges(infoChange.UserID, infoChange)
      .subscribe(
        (response) => {
          console.log(
            'Cambio de título aprobado:',
            infoChange.JobTitleChangeID,
            response
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cambio de título aprobado exitosamente.',
          });
          this.pendingChanges = this.pendingChanges.filter(
            (c) => c.JobTitleChangeID !== pendingChange.JobTitleChangeID
          );
        },
        (error) => {
          console.error('Error al aprobar el cambio de título:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo aprobar el cambio de título.',
          });
        }
      );
  }

  denyChange(pendingChange: any) {
    const infoChange = {
      DepartmentChangeID: pendingChange.DepartmentChangeID,
      JobTitleChangeID: pendingChange.JobTitleChangeID,
      UserID: pendingChange.UserID,
    };

    console.log('Datos Enviados para denegación:', JSON.stringify(infoChange));

    this.jobTitleChangeService
      .denyChanges(infoChange.UserID, infoChange)
      .subscribe(
        (response) => {
          console.log('Cambio de título denegado:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cambio de título denegado exitosamente.',
          });
          this.pendingChanges = this.pendingChanges.filter(
            (c) => c.JobTitleChangeID !== pendingChange.JobTitleChangeID
          );
        },
        (error) => {
          console.error('Error al denegar el cambio de título:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo denegar el cambio de título.',
          });
        }
      );
  }
}
