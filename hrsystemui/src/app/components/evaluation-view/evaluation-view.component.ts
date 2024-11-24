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
import { RouterModule } from '@angular/router';
import { EvaluationMasterService } from '../../services/evaluation-master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-view',
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
    RouterModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    EvaluationMasterService,
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
  templateUrl: './evaluation-view.component.html',
  styleUrl: './evaluation-view.component.css'
})
export class EvaluationViewComponent {
  filterGlobal(arg0: EventTarget | null) {
    throw new Error('Method not implemented.');
  }

  evaluations: any[] = [];
  selectedEvaluations: any[] = [];
  loggedUserId: number | null = null;
  users: any[] = [];
  userSelected: number | null = null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private userService: UserService,
    private evaluationService: EvaluationMasterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.evaluationService.getAllEvaluationMasterDetails().subscribe((data: any[]) => {
      console.log('Datos de evaluaciones:', data);
      this.evaluations = data;
    });
    this.loggedUserId = this.authService.getUserId();
    this.loadUsers();
  }

  goToEvaluationDetails(EvaluationMasterID: number): void {
    console.log('Navigating to evaluation ID:', EvaluationMasterID);
    this.router.navigate(['/home/evaluation/details', EvaluationMasterID], {
      replaceUrl: true,
    });
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
}
