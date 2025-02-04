import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
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
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { JobtitleDepartmentService } from '../../services/job-title-department.service';
import { AuthService } from '../../services/auth.service';
import { CalendarModule } from 'primeng/calendar'; 


@Component({
  selector: 'app-user-view',
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
    ConfirmDialogModule,
    CalendarModule,
  ],
  providers: [MessageService, ConfirmationService, UserService],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent implements OnInit {
  @ViewChild('dt') dt: any;

  users: any[] = [];
  selectedUsers: any[] = [];
  userDialog: boolean = false;
  user!: any;
  submitted: boolean = false;
  departments: any[] = [];
  selectedDepartment: number | null = null;
  jobTitles: any[] = [];
  selectedFile: File | null = null;
  loggedUserId: number | null = null;
  managers: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private departmentService: DepartmentService,
    private jobTitleDepartmentService: JobtitleDepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.getUsersFiltered().subscribe((data: any[]) => {
      console.log('Usuarios:', data);
      this.users = data;
    });

    this.loadDepartments();
    this.loadManagers();

    this.loggedUserId = this.authService.getUserId();
    console.log('Logged User ID - :', this.loggedUserId);
    console.log('Rol de usuario logueado:', this.authService.getRoleId());
  }

  onFilterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  loadManagers(): void {
    this.userService.getManagerUsers().subscribe(
      (dataUser) => {
        this.managers = dataUser;
        console.log('managers:', this.managers);
      },
      (error) => {
        console.error('Error al cargar managers:', error);
      }
    );
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      (dataDepto) => {
        this.departments = dataDepto;
      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    );
  }

  onDepartmentSelect(event: any) {
    this.selectedDepartment = event.value;
    console.log('ID del Departamento seleccionado:', this.selectedDepartment); // Verificación
    if (this.selectedDepartment) {
      this.loadJobTitlesByDepartment(this.selectedDepartment);
    }
  }

  loadJobTitlesByDepartment(departmentID: number): void {
    this.jobTitleDepartmentService
      .getJobTitlesByDepartmentId(departmentID)
      .subscribe(
        (dataJobTitles) => {
          this.jobTitles = Array.isArray(dataJobTitles)
            ? dataJobTitles
            : [dataJobTitles];
          console.log('Job Titles cargados:', this.jobTitles);
        },
        (error) => {
          console.error('Error al cargar puestos de trabajo:', error);
          this.jobTitles = [];
        }
      );
  }

  goToUserDetails(userId: number): void {
    console.log('Navigating to user ID:', userId);
    this.router.navigate(['/home/user', userId], { replaceUrl: true });
  }

  goToUserDocs(userId: number): void {
    console.log('Navigating to user ID:', userId);
    this.router.navigate(['/home/user/docs', userId], { replaceUrl: true });
  }

  openNew() {
    this.user = {
      FirstName: '',
      LastName: '',
      PersonalEmail: '',
      BirthDate: '',
      DepartmentID: null,
      JobTitleID: null,
      ManagerID: null,
      Gender: '',
      PhoneNumber: '',
      TaxID: '',
      StreetAddress: '',
      City: '',
      State: '',
      PostalCode: '',
      Country: '',
      CreatedBy: this.loggedUserId,
    };
    this.submitted = false;
    this.userDialog = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.files[0];
  }

  onUpload(event: any): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('createdBy', String(this.loggedUserId));

      this.userService.importUsersFromCSV(this.selectedFile).subscribe(
        (response) => {
          console.log('Archivo CSV importado correctamente:', response);
          alert('Archivo CSV importado correctamente');
        },
        (error) => {
          console.error('Error al importar el archivo CSV:', error);
          alert('Error al importar el archivo CSV');
        }
      );
    } else {
      alert('Por favor, selecciona un archivo');
    }
  }

  deactivateUser(userID: number) {
    const user = this.users.find((u) => u.UserID === userID);

    if (!user) {
      console.error('Usuario no encontrado');
      return;
    }

    this.confirmationService.confirm({
      message: '¿Está seguro de desactivar a ' + user.FirstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletedBy = this.loggedUserId;

        this.userService
          .deactivateUser(userID, { DeletedBy: deletedBy })
          .subscribe(() => {
            const index = this.findIndexById(userID);
            if (index !== -1) {
              this.users[index].status = false;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Usuario desactivado.',
              life: 3000,
            });
          });
      },
    });
  }

  deleteUser(userID: number) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );
    if (confirmed) {
      this.userService.deleteUser(userID).subscribe(
        (response) => {
          console.log('ID de usuario eliminado:', userID);
          console.log('Usuario eliminado exitosamente', response);

          this.users = this.users.filter((user) => user.UserID !== userID);

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario eliminado correctamente.',
            life: 3000,
          });
        },
        (error) => {
          console.error('Error al eliminar usuario', error);
        }
      );
    }
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.FirstName?.trim() && this.user.LastName?.trim()) {
      console.log('Datos del usuario antes de actualizar:', this.user);

      if (this.user.UserID) {
        this.userService
          .updateUser(this.user.UserID, this.user)
          .subscribe(() => {
            const index = this.findIndexById(this.user.UserID);
            if (index !== -1) {
              this.users[index] = { ...this.user };
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Usuario Actualizado.',
              life: 3000,
            });
            this.userDialog = false;
            this.user = {};
          });
      } else {
        this.userService.postUser(this.user).subscribe((newUser) => {
          console.log('Datos del usuario después de enviar:', newUser);
          this.users.push(newUser);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Usuario Creado.',
            life: 3000,
          });
          this.userDialog = false;
          this.user = {};
        });
      }
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].UserID === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
