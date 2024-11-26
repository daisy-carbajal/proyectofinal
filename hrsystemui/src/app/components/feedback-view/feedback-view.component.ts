import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { UserService } from '../../services/user.service';
import { TypeFeedbackService } from '../../services/type-feedback.service';
import { FeedbackService } from '../../services/feedback.service';
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { CommentFeedbackService } from '../../services/comment-feedback.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-feedback-view',
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    FormsModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    EditorModule,
    DialogModule,
    DataViewModule,
    TagModule,
    BadgeModule,
    SidebarModule,
    DividerModule
  ],
  providers: [UserService],
  templateUrl: './feedback-view.component.html',
  styleUrl: './feedback-view.component.css',
})
export class FeedbackViewComponent implements OnInit {

  feedbackDialog: boolean = false;
  commentDialog: boolean = false;
  users: any[] = [];
  userSelected: number | null = null;
  typeFeedback: any[] = [];
  typeFeedbackSelected: number | null = null;
  submitted: boolean = false;
  submittedComment: boolean = false;
  feedbacks: any[] = [];
  comments: any[] = [];
  selectedFeedback: any = null;
  selectedComment: any = null;

  feedback: any = {
    UserID: null,
    TypeID: null,
    Subject: '',
    Comment: '',
  }

  constructor (
    private userService: UserService,
    private typeFeedbackService: TypeFeedbackService,
    private feedbackService: FeedbackService,
    private commentFeedbackService: CommentFeedbackService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTypeFeedback();
    this.loadFeedback();
  }

  showDialog() {
    this.feedbackDialog = true;
  }

  hideDialog() {
    this.feedbackDialog = false;
    this.submitted = false;
  }

  showCommentDialog(feedback: any): void {
    console.log('Feedback seleccionado:', feedback); // Verifica que FeedbackID exista
    this.selectedFeedback = { ...feedback };
    this.comments = []; // Limpia el array de comentarios
  
    if (feedback.FeedbackID > 0) {
      // Usa FeedbackID exactamente como está en el JSON
      this.loadComments(feedback.FeedbackID);
    } else {
      console.log('No hay comentarios disponibles para este feedback.');
    }
  
    this.commentDialog = true; // Abre el sidebar
  }
  
  loadComments(feedbackID: number): void {
    console.log('Cargando comentarios para FeedbackID:', feedbackID);
    this.commentFeedbackService.getCommentFeedbackByFeedbackID(feedbackID).subscribe(
      (dataComment) => {
        console.log('Comentarios cargados:', dataComment); // Verifica que la respuesta sea correcta
        this.comments = dataComment || [];
      },
      (error) => {
        console.error('Error al cargar comentarios:', error);
        this.comments = [];
      }
    );
  }

  hideCommentDialog() {
    this.commentDialog = false;
    this.submittedComment = false;
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

  loadTypeFeedback(): void {
    this.typeFeedbackService.getAllTypeFeedbacks().subscribe(
      (dataType) => {
        console.log('Datos de tipos:', dataType);
        this.typeFeedback = dataType;
      },
      (error) => {
        console.error('Error al cargar tipos de feedback:', error);
      }
    );
  }

  onTypeFeedbackSelected(event: any) {
    this.typeFeedbackSelected = event.value;
    console.log('ID del tipo seleccionado:', this.typeFeedbackSelected);
  }

  loadFeedback(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
  (dataFeedback) => {
    this.feedbacks = dataFeedback.map((fb: any) => ({
      ...fb,
      NumberOfComments: fb.NumberOfComments || 0 // Asegura que siempre haya un valor numérico
    }));
  },
  (error) => {
    console.error('Error al cargar feedbacks:', error);
  }
);
  }
}
