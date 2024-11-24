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
import { DisciplinaryActionWarningLevelService } from '../../services/disciplinary-action-warning-level.service';

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
    DisciplinaryActionWarningLevelService
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
  templateUrl: './da-warning-level-view.component.html',
  styleUrls: ['./da-warning-level-view.component.css']
})
export class DaWarningLevelViewComponent implements OnInit {

  @ViewChild('dt') dt: any;

  warnings: any[] = [];
  selectedWarnings: any[] = [];
  warningDialog: boolean = false;
  warning!: any;
  submitted: boolean = false;

  constructor(
    private daWarningLevelService: DisciplinaryActionWarningLevelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.daWarningLevelService.getAllWarningLevels().subscribe((data: any[]) => {
      console.log('Datos de warnings:', data);
      this.warnings = data;
    });
  }

  onFilterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }


  openNew() {
    this.warning = {
      WarningLevel: ''
    };
    this.submitted = false;
    this.warningDialog = true;
  }

  editWarning(warning: any) {
    this.warning = { ...warning };
    this.warningDialog = true;
  }

  deleteWarning(warningID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar esta advertencia?'
    );
    if (confirmed) {
      this.daWarningLevelService.deleteWarningLevel(warningID).subscribe(
        (response) => {
          console.log('ID de advertencia eliminada:', warningID);
          console.log('Adevertencia eliminada exitosamente', response);

          this.warnings = this.warnings.filter(
            (warning) => warning.warningID !== warningID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Advertencia eliminada correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar advertencia', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el advertencia.',
            life: 3000,
          });
        }
      );
    }
  }

  deactivateWarning(warning: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro de borrar ${warning.WarningLevel}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!warning.warningID) {
          console.error('Advertencia ID no válida:', warning.warningID);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El ID de advertencia no es válido.',
            life: 3000,
          });
          return;
        }
  
        console.log('Advertencia a desactivar:', warning.warningID);
  
        this.daWarningLevelService.deactivateWarningLevel(warning.warningID).subscribe(
          (response) => {
            console.log('Respuesta de desactivación:', response);
  
            const index = this.findIndexById(warning.warningID);
            if (index !== -1) {
              this.warnings[index].status = false; 
            }
  
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Advertencia desactivada correctamente.',
              life: 3000,
            });
          },
          (error) => {
            console.error('Error al desactivar advertencia:', error);
  
            // Manejar error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo desactivar la adevertencia.',
              life: 3000,
            });
          }
        );
      },
    });
  }

  refreshWarnings() {
    this.daWarningLevelService.getAllWarningLevels().subscribe((data: any[]) => {
      this.warnings = data;
    });
  }

  hideDialog() {
    this.warningDialog = false;
    this.submitted = false;
  }

  saveWarning() {
    this.submitted = true;
  
    if (this.warning.WarningLevel?.trim()) {
      console.log('Datos de la advertencia antes de actualizar:', this.warning);
  
      if (this.warning.warningID) {
        this.daWarningLevelService
          .updateWarningLevel(this.warning.warningID, this.warning)
          .subscribe(() => {
            const index = this.findIndexById(this.warning.warningID);
            if (index !== -1) {
              this.warnings[index] = this.warning;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Advertencia Actualizada.',
              life: 3000,
            });
          });
      } else {
        this.daWarningLevelService
          .postWarningLevel({
            WarningLevel: this.warning.WarningLevel
          })
          .subscribe((newWarning) => {
            console.log('Datos de la advertencia antes de enviar:', newWarning);
            this.warnings.push(newWarning);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Advertencia Creada.',
              life: 3000,
            });
          });
      }
      this.refreshWarnings();
      this.warningDialog = false;
      this.warning = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.warnings.length; i++) {
      if (this.warnings[i].warningID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
} 