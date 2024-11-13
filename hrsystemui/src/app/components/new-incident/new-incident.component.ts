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
  ],
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
    Comments: '',
    CreatedBy: null,
  };

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private userService: UserService,
    private incidentTypeService: IncidentTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedUserId = this.authService.getUserId();
    console.log('Logged User ID - :', this.loggedUserId);
  }

  timeOptions = [
    { label: 'Minutos', value: 'mins' },
    { label: 'Horas', value: 'hours' },
    { label: 'Días', value: 'days' },
  ];

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

  saveIncident(): void {
    const incidentData = {
      IncidentTypeName: this.incident.IncidentTypeID,
      UserID: this.incident.UserID,
      Reason: this.incident.Reason,
      Date: new Date(this.incident.Date).toISOString(),
      Duration: this.incident.Duration,
      Comments: this.incident.Comments,
      CreatedBy: this.loggedUserId,
    };

    console.log('Datos del incidente a enviar:', incidentData);
    this.incidentService.postIncident(incidentData).subscribe(
      (response) => {
        console.log('Incidente registrado con éxito', response);
      },
      (error) => {
        console.error('Error al registrar el incidente', error);
      }
    );
  }
}
