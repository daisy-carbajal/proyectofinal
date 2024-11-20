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
import { UserService } from '../../services/user.service';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DepartmentService } from '../../services/department.service';
import { ChangeReasonService } from '../../services/change-reason.service';
import { JobtitleDepartmentService } from '../../services/job-title-department.service';
import { JobtitleChangeService } from '../../services/job-title-change.service';
import { DepartmentChangeService } from '../../services/department-change.service';

@Component({
  selector: 'app-employee-change-record',
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
    UserService,
    DepartmentService,
    JobtitleDepartmentService,
    ChangeReasonService,
    JobtitleChangeService,
    DepartmentChangeService
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
  templateUrl: './employee-change-record.component.html',
  styleUrls: ['./employee-change-record.component.css'],
})
export class EmployeeChangeRecordComponent implements OnInit {

  loggedUserId: number | null = null;
  selectedIncidents: any[] = [];
  incidentDialog: boolean = false;
  information: any = {
    UserID: null,
    DepartmentID: null,
    JobPositionID: null,
    StartDate: null,
    ChangeReasonID: null,
    Comments: '',
    CreatedBy: ''
  };
  submitted: boolean = false;
  users: any[] = [];
  departments: any[] = [];
  jobTitles: any[] = [];
  reasonOptions: any[] = []; // Opciones de razón

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private jobTitleDepartmentService: JobtitleDepartmentService,
    private changeReasonService: ChangeReasonService,
    private jobTitleChangeService: JobtitleChangeService,
    private departmentChangeService: DepartmentChangeService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadDepartments();
    this.loadReasons();
    this.loggedUserId = this.authService.getUserId();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (dataUser ) => {
        this.users = dataUser ;
        console.log(dataUser);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      (dataDepto) => {
        this.departments = dataDepto;
        console.log("Data de Deptos:", dataDepto);
      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    );
  }

  loadReasons(): void {
    this.changeReasonService.getAllChangeReasons().subscribe(
      (dataReasons) => {
        this.reasonOptions = dataReasons;
        console.log(this.reasonOptions);
      },
      (error) => {
        console.error('Error al cargar razones:', error);
      }
    );
  }

  onDepartmentSelect(event: any) {
    this.information.DepartmentID = event.value;
    if (this.information.DepartmentID) {
      this.loadJobTitlesByDepartment(this.information.DepartmentID);
    }
  }

  loadJobTitlesByDepartment(departmentID: number): void {
    this.jobTitleDepartmentService.getJobTitlesByDepartmentId(departmentID).subscribe(
      (dataJobTitles) => {
        this.jobTitles = Array.isArray(dataJobTitles) ? dataJobTitles : [dataJobTitles];
        console.log("Puestos:", dataJobTitles);
      },
      (error) => {
        console.error('Error al cargar puestos de trabajo:', error);
        this.jobTitles = [];
      }
    );
}

  onUserSelected(event: any) {
    this.information.UserID = event.value;
    console.log('Usuario seleccionado:', this.information.UserID);
  }

  saveInformation() {
    const departmentChange = {
      UserID: this.information.UserID, 
      DepartmentID: this.information.DepartmentID,
      StartDate: this.information.StartDate,
      ChangeReasonID: this.information.ReasonID,
      CreatedBy: this.loggedUserId
    };
  
    const jobTitleChange = {
      UserID: this.information.UserID, 
      JobTitleID: this.information.JobPositionID,
      StartDate: this.information.StartDate,
      ChangeReasonID: this.information.ReasonID,
      CreatedBy: this.loggedUserId
    };
  
    console.log("Datos Enviados:", JSON.stringify(departmentChange), JSON.stringify(jobTitleChange));
  
    this.departmentChangeService.postDepartmentChange(departmentChange).subscribe(
      (response) => {
        console.log('Cambio de departamento guardado:', response);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cambio de departamento guardado exitosamente.' });
      },
      (error) => {
        console.error('Error al guardar cambio de departamento:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el cambio de departamento.' });
      }
    );
  
    this.jobTitleChangeService.postJobTitleChange(jobTitleChange).subscribe(
      (response) => {
        console.log('Cambio de puesto de trabajo guardado:', response);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cambio de puesto de trabajo guardado exitosamente.' });
      },
      (error) => {
        console.error('Error al guardar cambio de puesto de trabajo:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el cambio de puesto de trabajo.' });
      }
    );

    this.clearForm();
  }

  hideDialog() {
    this.incidentDialog = false;
    this.submitted = false;
  }

  clearForm() {
    this.information = {
      UserID: null,
      DepartmentID: null,
      JobPositionID: null,
      StartDate: null,
      ChangeReasonID: null,
      Comments: '',
    };
  
    this.jobTitles = [];
  }
}