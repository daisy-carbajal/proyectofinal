import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-userdetailview',
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
    ToastModule,
  ],
  providers: [ConfirmationService, FileUploadService, AuthService, UserService, MessageService],
  templateUrl: './user-documents-view.component.html',
  styleUrls: ['./user-documents-view.component.css'],
})
export class UserDocumentsViewComponent implements OnInit {
  employeeName = '';
  workEmail = '';
  jobTitle = '';
  department = '';
  userId!: number;
  role = null;

  fileUploadDialog: boolean = false;
  selectedFile!: File | null;
  uploadedFiles: { name: string; url: string }[] = [];

  constructor(
    private fileUploadService: FileUploadService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserData(this.userId);
        this.loadUserFiles();
      }
    });
  }

  goBackToUsers(): void {
    this.router.navigate(['/home/user'], { replaceUrl: true });
  }

  loadUserData(userId: number): void {
    this.userService.getUserDetailsById(userId).subscribe((data) => {
      this.employeeName = `${data.FirstName} ${data.LastName}`;
      this.workEmail = data.WorkEmail;
      this.jobTitle = data.JobTitle || 'Sin puesto asignado';
      this.department = data.Department || 'Sin departamento asignado';
      this.role = data.Role || 'Sin rol asignado';
    });
  }

  openFileUploadDialog() {
    this.fileUploadDialog = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Selecciona un archivo primero',
      });
      return;
    }

    this.fileUploadService.uploadUserFile(this.userId, this.selectedFile).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo subido correctamente',
        });
        this.fileUploadDialog = false;
        this.loadUserFiles();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo subir el archivo',
        });
      }
    );
  }

  loadUserFiles() {
    this.fileUploadService.getUserFiles(this.userId).subscribe(
      (files) => {
        this.uploadedFiles = files;
      },
      (error) => {
        console.error('Error al cargar archivos:', error);
      }
    );
  }

  viewFile(fileName: string) {
    this.fileUploadService.getSignedFileUrl(this.userId, fileName).subscribe(
      response => {
        window.open(response.url, "_blank");
      },
      error => {
        console.error("Error al obtener la URL firmada:", error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el archivo.'
        });
      }
    );
  }

  deleteFile(fileName: string) {
    this.fileUploadService.deleteUserFile(this.userId, fileName).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo eliminado',
        });
        this.loadUserFiles();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el archivo',
        });
      }
    );
  }
}
