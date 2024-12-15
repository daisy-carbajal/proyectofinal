import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { EvaluationSavedService } from '../../services/evaluation-saved.service';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { EvaluationParameterService } from '../../services/evaluation-parameter.service';
import { EvaluationCalificationService } from '../../services/evaluation-calification.service';
import { EvaluationMasterService } from '../../services/evaluation-master.service';
import { ToastModule } from 'primeng/toast';

interface Evaluation {
  EvaluationID?: number;
  Parameters?: Parameter[];
}

interface Parameter {
  CalificationID: any;
  EvaluationParameterID?: number;
}

@Component({
  selector: 'app-new-evaluation',
  standalone: true,
  imports: [
    ChipsModule,
    CardModule,
    RippleModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    EditorModule,
    CalendarModule,
    DropdownModule,
    ToastModule
  ],
  providers: [UserService, MessageService],
  templateUrl: './new-evaluation.component.html',
  styleUrl: './new-evaluation.component.css',
})
export class NewEvaluationComponent implements OnInit {

  users: any[] = [];
  userSelected: number | null = null;
  evaluation: Evaluation | null = null;
  evaluationSaved: any[] = [];
  parameters: any[] = [];
  califications: any[] = [];
  selectedCalification: any;
  dropdownClass: string = '';
  selectedEvaluateeUserID: number | null = null; 
  selectedEvaluationSavedID: number | null = null; 
  dateCreated: Date | null = null; 
  dateToReview: Date | null = null;
  editorContent: string = ''; 
  showAreasAEvaluar: boolean = false;
  evaluatorUserID: number | null = null;
  evaluateeUserID: number | null = null;
  evaluationDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private evaluationSavedService: EvaluationSavedService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private parameterService: EvaluationParameterService,
    private calificationService: EvaluationCalificationService,
    private evaluationService: EvaluationMasterService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvaluations();
    this.loadParameters();
    this.loadCalifications();
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

  loadEvaluations() {
    this.evaluationSavedService.getAllEvaluationSaved().subscribe((dataEval) => {
      console.log('Evaluaciones:', dataEval);
      this.evaluationSaved = dataEval;
    });
  }

  onEvaluationSelected(evaluationId: number) {
    this.loadEvaluationById(evaluationId);
    if (evaluationId) {
      this.showAreasAEvaluar = true;
    } else {
      this.showAreasAEvaluar = false;
    }
  }

  loadEvaluationById(id: number) {
    this.evaluationSavedService.getEvaluationSavedById(id).subscribe(
      (dataSaved: Evaluation) => {
        console.log('Evaluación Cargada:', dataSaved);
        this.evaluation = dataSaved; // Asignar el objeto a la propiedad correcta
        if (!this.evaluation.Parameters) {
          this.evaluation.Parameters = []; // Inicializar si no existen
        }
        console.log('Evaluation ID:', this.evaluation.EvaluationID);
        this.cdr.detectChanges();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la evaluación.',
        });
      }
    );
  }

  loadParameters() {
    this.parameterService
      .getAllEvaluationParameters()
      .subscribe((dataParam) => {
        console.log('Parametros:', dataParam);
        this.parameters = dataParam;
      });
  }

  loadCalifications() {
    this.calificationService.getAllEvaluationCalifications()
      .subscribe((dataCalif) => {
        console.log('Calificaciones:', dataCalif);
        this.califications = dataCalif;
      });
  }

  trackByParameter(index: number, parameter: any): number {
    return parameter.EvaluationParameterID || index;
  }

  trackByCalification(index: number, calification: any): number {
    return calification.EvaluationCalificationID || index;
  }

  goBackToHome(): void {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  saveEvaluation(): void {
    // Verifica que los campos requeridos estén completos
    if (!this.evaluatorUserID || !this.evaluateeUserID || !this.selectedEvaluationSavedID || !this.dateCreated || !this.dateToReview) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos requeridos.' });
      return;
    }
  
    // Asegúrate de que this.evaluation.Parameters esté correctamente poblado
    const details = this.evaluation?.Parameters?.map(parameter => ({
      ParameterID: parameter.EvaluationParameterID,
      CalificationID: parameter.CalificationID // Asegúrate de que esta propiedad esté correctamente definida
    })) || [];

    const formattedDateCreated = this.dateCreated?.toISOString();

    const formattedDateToReview = this.dateToReview?.toISOString();
  
    // Estructura los datos correctamente para enviarlos al backend
    const evaluationMaster = {
      EvaluatorUserID: this.evaluatorUserID,
      EvaluateeUserID: this.evaluateeUserID,
      EvaluationSavedID: this.selectedEvaluationSavedID,
      DateCreated: formattedDateCreated,
      DateToReview: formattedDateToReview,
      Comments: this.editorContent,
      Details: details
    };

    console.log("Datos Enviados:", evaluationMaster);
  
    this.evaluationService.postEvaluationMaster(evaluationMaster)
      .subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message });
        this.clearForm()
              },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la evaluación.' });
        }
      );
  }

  clearForm() {
    this.evaluatorUserID = null;
    this.evaluateeUserID = null;
    this.selectedEvaluationSavedID = null;
    this.dateCreated = null;
    this.dateToReview = null;
    this.editorContent = ''; 
    this.evaluationDetails = [];
    this.evaluation = null;
    this.userSelected = null;
    this.selectedEvaluateeUserID = null;
  }
}
