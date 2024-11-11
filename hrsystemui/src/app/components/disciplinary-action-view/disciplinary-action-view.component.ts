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


@Component({
  selector: 'app-disciplinary-action-view',
  standalone: true,
  imports: [TableModule,
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
  templateUrl: './disciplinary-action-view.component.html',
  styleUrl: './disciplinary-action-view.component.css'
})
export class DisciplinaryActionViewComponent {
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
  selectedTimeUnit: string = 'mins';

  constructor(
    private incidentService: IncidentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private incidentTypeService: IncidentTypeService,
    private userService: UserService
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

  editIncident(incident: any) {
    this.incident = { ...incident };
    if (this.incident.Date) {
      this.incident.Date = new Date(this.incident.Date);
  }
    this.incidentDialog = true;
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

  deactivateIncident(incident: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de borrar ' + incident.IncidentTypeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Incidente a Desactivar:' + incident.IncidentID);

        const deletedBy = this.loggedUserId;

        this.incidentService
          .deactivateIncident(incident.IncidentID, { DeletedBy: deletedBy })

          .subscribe(() => {
            const index = this.findIndexById(incident.IncidentID);
            if (index !== -1) {
              this.incidents[index].status = false;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Incidente Borado.',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.incidentDialog = false;
    this.submitted = false;
  }

  saveIncident() {
    this.submitted = true;

    if (this.incident.IncidentTypeName?.trim()) {
      console.log('Datos del incidente antes de actualizar:', this.incident);

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
        this.incidentService
          .postIncident(this.incident)
          .subscribe((newIncident) => {
            console.log('Datos del incidente antes de enviar:', this.incident);
            this.incidents.push(newIncident);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Incidente Creado.',
              life: 3000,
            });
          });
      }

      this.incidents = [...this.incident];
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
    { label: 'Minutos', value: 'mins' },
    { label: 'Horas', value: 'hours' },
    { label: 'Días', value: 'days' },
  ];

  convertAndSend() {
    if (this.timeValue !== null && this.selectedTimeUnit) {
      let timeInMinutes = this.timeValue;

      if (this.selectedTimeUnit === 'hours') {
        timeInMinutes = this.timeValue * 60;
      } else if (this.selectedTimeUnit === 'days') {
        timeInMinutes = this.timeValue * 60 * 24;
      }

      console.log('Tiempo en minutos:', timeInMinutes);
    } else {
      console.error('Por favor ingresa una cantidad y selecciona una unidad.');
    }
  }
}
