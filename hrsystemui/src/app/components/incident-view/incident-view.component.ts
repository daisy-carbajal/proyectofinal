import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IncidentService } from '../../services/incident.service';
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
import { IncidentTypeService } from '../../services/incident-type.service';
import { UserService } from '../../services/user.service';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incident-view',
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
    CalendarModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    IncidentService,
    IncidentTypeService,
    UserService,
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
  templateUrl: './incident-view.component.html',
  styleUrl: './incident-view.component.css',
})
export class IncidentViewComponent implements OnInit {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  incidents: any[] = [];
  selectedIncidents: any[] = [];
  incidentDialog: boolean = false;
  incident!: any;
  submitted: boolean = false;
  loggedUserId: number | null = null;
  incidentTypes: any[] = [];
  incidentTypeSelected: number | null = null;
  users: any[] = [];
  userSelected: number | null = null;
  timeValue: number | null = null;
  selectedTimeUnit: string = '';

  constructor(
    private incidentService: IncidentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private incidentTypeService: IncidentTypeService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.incidentService.getAllIncidents().subscribe((data: any[]) => {
      console.log('Datos de incidentes:', data);
      this.incidents = data;
    });
    this.loggedUserId = this.authService.getUserId();
    this.loadIncidentTypes();
    this.loadUsers();
  }

  openNew() {
    this.incident = {
      IncidentTypeID: null,
      UserID: null,
      Reason: '',
      Date: null,
      Duration: null,
      Unit: null,
      Comments: '',
    };
    this.submitted = false;
    this.incidentDialog = true;
  }

  loadIncidentTypes(): void {
    this.incidentTypeService.getAllIncidentTypes().subscribe(
      (dataType) => {
        console.log('Datos de tipos:', dataType);
        this.incidentTypes = dataType;
      },
      (error) => {
        console.error('Error al cargar tipos de incidente:', error);
      }
    );
  }

  onIncidentTypeSelect(event: any) {
    this.incidentTypeSelected = event.value;
    console.log(
      'ID del Tipo de Incidente seleccionado:',
      this.incidentTypeSelected
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (dataUser) => {
        console.log('Datos de usuaros:', dataUser);
        this.users = dataUser;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  onUserSelected(event: any) {
    this.userSelected = event.value;
    console.log('ID del Usuario seleccionado:', this.userSelected);
  }

  approveIncident(incident: any) {
    if (!incident || !incident.IncidentID) {
      console.error('El objeto incidente no es válido:', incident);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El incidente no tiene un ID válido.',
        life: 3000,
      });
      return;
    }

    console.log('Datos a aprobar:', incident);
    this.confirmationService.confirm({
      message: `¿Está seguro de aprobar el incidente para "${incident.FullName}"?`,
      header: 'Confirmación',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.incidentService.approveIncident(incident.IncidentID).subscribe(
          () => {
            const index = this.findIndexById(incident.IncidentID);
            console.log('ID aprobado:', incident.IncidentID);
            if (index !== -1) {
              this.incidents[index].Status = true; // Actualiza el estado en la lista
            }

            this.refreshIncident();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'El incidente ha sido aprobado correctamente.',
              life: 3000,
            });
          },
          (error) => {
            console.error('Error al aprobar el incidente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo aprobar el incidente.',
              life: 3000,
            });
          }
        );
      },
    });
  }

  deleteIncident(IncidentID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este incident?'
    );
    if (confirmed) {
      this.incidentService.deleteIncident(IncidentID).subscribe(
        (response) => {
          console.log('ID de incidente eliminado:', IncidentID);
          console.log('Incidente eliminado exitosamente', response);

          this.incidents = this.incidents.filter(
            (incident) => incident.IncidentID !== IncidentID
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Incidente eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar incidente', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el incidente.',
            life: 3000,
          });
        }
      );
    }
  }

  hideDialog() {
    this.incidentDialog = false;
    this.submitted = false;
  }

  refreshIncident() {
    this.incidentService.getAllIncidents().subscribe((data: any[]) => {
      this.incidents = data;
    });
  }

  goToIncidentDetails(IncidentID: number): void {
    console.log('Navigating to incident ID:', IncidentID);
    this.router.navigate(['/home/incident/details', IncidentID], {
      replaceUrl: true,
    });
  }

  saveIncident() {
    console.log('saveIncident called');
    this.submitted = true;

    if (this.incident.Date) {
      this.incident.Date = new Date(this.incident.Date)
        .toISOString()
        .split('T')[0];
    }

    if (this.incident.Unit && typeof this.incident.Unit === 'object') {
      this.incident.Unit = this.incident.Unit.label;
    }

    if (this.incident.IncidentTypeID && this.incident.UserID) {
      console.log('Datos del incidente antes de enviar:', this.incident);

      if (this.incident.IncidentID) {
        this.incidentService
          .updateIncident(this.incident.IncidentID, this.incident)
          .subscribe(() => {
            const index = this.findIndexById(this.incident.IncidentID);
            if (index !== -1) {
              this.incidents[index] = this.incident;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Incidente Actualizado.',
              life: 3000,
            });
          });
      } else {
        this.incidentService.postIncident(this.incident).subscribe(
          (newIncident) => {
            console.log('Respuesta del backend:', newIncident);
            this.incidents = [...this.incidents, newIncident];
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Incidente creado correctamente.',
              life: 3000,
            });
            this.hideDialog();
            this.refreshIncident();
          },
          (error) => {
            console.error('Error al crear el incidente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el incidente.',
              life: 3000,
            });
          }
        );
      }

      this.incidentDialog = false;
      this.incident = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.incidents.length; i++) {
      if (this.incidents[i].JobTitleID === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  timeOptions = [
    { label: 'min', value: 'min' },
    { label: 'hr', value: 'hr' },
    { label: 'd', value: 'd' },
  ];
}
