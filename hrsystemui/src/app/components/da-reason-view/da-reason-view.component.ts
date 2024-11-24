import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DisciplinaryActionReasonService } from '../../services/disciplinary-action-reason.service';

@Component({
  selector: 'app-permissions-view',
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
    DropdownModule,
    TagModule,
    InputTextModule,
    FormsModule,
    CalendarModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DisciplinaryActionReasonService,
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
  templateUrl: './da-reason-view.component.html',
  styleUrls: ['./da-reason-view.component.css'],
})
export class DaReasonViewComponent implements OnInit {
  @ViewChild('dt') dt: any;

  reasons: any[] = [];
  selectedReasons: any[] = [];
  reasonDialog: boolean = false;
  reason!: any;
  submitted: boolean = false;

  constructor(
    private daReasonService: DisciplinaryActionReasonService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.daReasonService
      .getAllDisciplinaryActionReasons()
      .subscribe((data: any[]) => {
        console.log('Datos de razones:', data);
        this.reasons = data;
      });
  }

  onFilterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  openNew() {
    this.reason = {
      Description: '',
    };
    this.submitted = false;
    this.reasonDialog = true;
  }

  editReason(reason: any) {
    this.reason = { ...reason };
    this.reasonDialog = true;
  }

  deleteReason(reasonID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar esta razón?'
    );
    if (confirmed) {
      this.daReasonService.deleteDisciplinaryActionReason(reasonID).subscribe(
        (response) => {
          console.log('ID de advertencia eliminada:', reasonID);
          console.log('Adevertencia eliminada exitosamente', response);

          this.reasons = this.reasons.filter(
            (reason) => reason.reasonID !== reasonID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Razón eliminada correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar razón', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la razón.',
            life: 3000,
          });
        }
      );
    }
  }

  deactivateReason(reason: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro de borrar ${reason.Description}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!reason.reasonID) {
          console.error('Razón ID no válida:', reason.reasonID);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El ID de razón no es válido.',
            life: 3000,
          });
          return;
        }

        console.log('Razón a desactivar:', reason.reasonID);

        this.daReasonService
          .deactivateDisciplinaryActionReason(reason.reasonID)
          .subscribe(
            (response) => {
              console.log('Respuesta de desactivación:', response);

              const index = this.findIndexById(reason.reasonID);
              if (index !== -1) {
                this.reasons[index].status = false;
              }

              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Razón desactivada correctamente.',
                life: 3000,
              });
            },
            (error) => {
              console.error('Error al desactivar razón:', error);

              // Manejar error
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo desactivar la razón.',
                life: 3000,
              });
            }
          );
      },
    });
  }

  refreshReasons() {
    this.daReasonService
      .getAllDisciplinaryActionReasons()
      .subscribe((data: any[]) => {
        this.reasons = data;
      });
  }

  hideDialog() {
    this.reasonDialog = false;
    this.submitted = false;
  }

  saveReason() {
    this.submitted = true;

    if (this.reason.Description?.trim()) {
      console.log('Datos de la reazón antes de actualizar:', this.reason);

      if (this.reason.reasonID) {
        this.daReasonService
          .updateDisciplinaryActionReason(this.reason.reasonID, this.reason)
          .subscribe(() => {
            const index = this.findIndexById(this.reason.reasonID);
            if (index !== -1) {
              this.reasons[index] = this.reason;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Razón Actualizada.',
              life: 3000,
            });
          });
      } else {
        this.daReasonService
          .postDisciplinaryActionReason({
            Description: this.reason.Description,
          })
          .subscribe((newReason) => {
            console.log('Datos de la razón antes de enviar:', newReason);
            this.reasons.push(newReason);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Advertencia Creada.',
              life: 3000,
            });
          });
      }
      this.refreshReasons();
      this.reasonDialog = false;
      this.reason = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.reasons.length; i++) {
      if (this.reasons[i].warningID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
