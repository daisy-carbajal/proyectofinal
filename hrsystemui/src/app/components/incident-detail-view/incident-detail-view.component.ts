import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../../services/incident.service';
import { IncidentTypeService } from '../../services/incident-type.service';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { RoleService } from '../../services/role.service';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail-view.component.html',
  standalone: true,
  imports: [
    CardModule,
    RippleModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    CalendarModule,
    EditorModule,
    InputTextModule,
    InputTextareaModule,
  ],
  providers: [
    IncidentService,
    IncidentTypeService,
    UserService,
    MessageService,
    RoleService,
  ],
  styleUrls: ['./incident-detail-view.component.css'],
})
export class IncidentDetailViewComponent implements OnInit {
  incident: any = {
    IncidentID: null,
    IncidentTypeID: null,
    UserID: null,
    Reason: '',
    Date: null,
    Duration: null,
    Unit: '',
    Comments: '',
  };

  incidentTypes: any[] = [];
  users: any[] = [];
  timeOptions = [
    { label: 'min', value: 'min' },
    { label: 'hr', value: 'hr' },
    { label: 'd', value: 'd' },
  ];

  constructor(
    private incidentService: IncidentService,
    private incidentTypeService: IncidentTypeService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const incidentId = params.get('id'); // Extrae el ID del incidente desde la URL
      if (incidentId) {
        this.loadIncidentDetails(+incidentId); // Convierte a número y carga los datos
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se encontró un ID válido en la URL.',
        });
      }
    });
    this.loadIncidentTypes();
    this.loadUsers();
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

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (dataUser) => {
        this.users = dataUser;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  loadIncidentDetails(incidentId: number): void {
    this.incidentService.getIncidentById(incidentId).subscribe(
      (data) => {
        this.incident = data;
        if (this.incident.Date) {
          this.incident.Date = new Date(this.incident.Date);
        }
        console.log('Datos del incidente cargados:', this.incident);
      },
      (error) => {
        console.error('Error al cargar los detalles del incidente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el incidente.',
        });
      }
    );
  }

  updateIncident(): void {

    if (this.incident.Date) {
      this.incident.Date = new Date(this.incident.Date)
        .toISOString()
        .split('T')[0];
    }

    if (this.incident.Unit && typeof this.incident.Unit === 'object') {
      this.incident.Unit = this.incident.Unit.label;
    }

    if (this.incident.IncidentID) {
      this.incidentService
        .updateIncident(this.incident.IncidentID, this.incident)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Incidente actualizado correctamente.',
            });
            this.router.navigate(['/home/incident']);
          },
          (error) => {
            console.error('Error al actualizar el incidente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el incidente.',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se encontró un ID válido para el incidente.',
      });
    }
  }

  goBackToIncidents(): void {
    this.router.navigate(['/home/incident']);
  }
}
