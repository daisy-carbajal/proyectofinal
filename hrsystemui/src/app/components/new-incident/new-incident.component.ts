import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IncidentService } from '../../services/incident.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { IncidentTypeService } from '../../services/incident-type.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-incident',
  standalone: true,
  imports: [
    ChipsModule,
    CardModule,
    RippleModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    CalendarModule,
    EditorModule,
    InputTextareaModule,
  ],
  providers: [MessageService, IncidentService],
  templateUrl: './new-incident.component.html',
  styleUrl: './new-incident.component.css',
})
export class NewIncidentComponent implements OnInit {
  incidentTypes: any[] = [];
  incidentTypeSelected: number | null = null;
  users: any[] = [];
  userSelected: number | null = null;
  timeValue: number | null = null;
  selectedTimeUnit: string = 'mins';

  loggedUserId: number | null = null;

  incident = {
    IncidentTypeID: null,
    UserID: null,
    Reason: '',
    Date: '',
    Duration: null,
    Unit: null,
    Comments: '',
    CreatedBy: null,
  };

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private userService: UserService,
    private incidentTypeService: IncidentTypeService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loggedUserId = this.authService.getUserId();
    console.log('Logged User ID - :', this.loggedUserId);
    this.loadIncidentTypes();
    this.loadUsers();
  }

  loadIncidentTypes(): void {
    this.incidentTypeService.getAllIncidentTypes().subscribe(
      (dataType) => {
        console.log('Datos de tipos:', dataType);
        this.incidentTypes = dataType;
        console.log('Tipos de Incidentes:', this.incidentTypes);
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

  goBackToHome(): void {
    this.router.navigate(['/home'], { replaceUrl: true });
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

  saveIncident() {
    console.log('saveIncident called');

    if (this.incident.Date) {
      this.incident.Date = new Date(this.incident.Date)
        .toISOString()
        .split('T')[0];
    }

    if (this.incident.IncidentTypeID && this.incident.UserID) {
      console.log('Datos del incidente antes de enviar:', this.incident);
      this.incidentService.postIncident(this.incident).subscribe(
        (newIncident) => {
          console.log('Respuesta del backend:', newIncident);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Incidente creado correctamente.',
            life: 3000,
          });
          this.clearForm();
          this.goBackToHome();
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
  }

  clearForm() {
    this.incident = {
      IncidentTypeID: null,
      UserID: null,
      Reason: '',
      Date: '',
      Duration: null,
      Unit: null,
      Comments: '',
      CreatedBy: null,
    };
  }

  timeOptions = [
    { label: 'min', value: 'min' },
    { label: 'hr', value: 'hr' },
    { label: 'd', value: 'd' },
  ];
}
