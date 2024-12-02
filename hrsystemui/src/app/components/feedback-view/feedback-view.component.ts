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
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    DividerModule,
  ],
  providers: [UserService, MessageService],
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
  numberOfComments: number = 0;
  showDetalles: boolean = false;
  showDetallesFeedback: boolean = false;
  newComment: string = '';
  editFeedbackDialog: boolean = false;

  feedback: any = {
    UserID: null,
    TypeID: null,
    Subject: '',
    Comment: '',
  };

  comment: any = {
    FeedbackID: null,
    Comment: '',
  };

  constructor(
    private userService: UserService,
    private typeFeedbackService: TypeFeedbackService,
    private feedbackService: FeedbackService,
    private commentFeedbackService: CommentFeedbackService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
  ) {}

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

    this.commentDialog = true;
  }

  hideCommentDialog() {
    console.log("cerrando sidebar.");
    this.commentDialog = false;
    this.submittedComment = false;
  }

  editComment(feedback: any) {
    this.feedback = { ...feedback }; // Clona el feedback seleccionado
    this.editFeedbackDialog = true;
  }

  cancelEdit() {
    this.newComment = ''; // Limpiar el editor
    this.editFeedbackDialog = false; // Ocultar el editor
    this.selectedComment = null; // Limpiar el comentario seleccionado
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
        this.feedbacks = dataFeedback;
        this.feedback.Comment = dataFeedback.Comment;
      },
      (error) => {
        console.error('Error al cargar feedbacks:', error);
      }
    );
  }

  loadComments(feedbackID: number): void {
    console.log('Cargando comentarios para FeedbackID:', feedbackID);
    this.commentFeedbackService
      .getCommentFeedbackByFeedbackID(feedbackID)
      .subscribe(
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

  addNewComment() {
    this.comment.Comment = '';
    this.showDetalles = true; // Esto muestra el editor
  }

  removeNewComment(index: number) {
    this.comment.Comment.splice(index, 1);

    if (this.comment.Comment.length === 0) {
      this.showDetalles = false;
    }
  }

  saveFeedback() {
    this.submitted = true;
  
    if (this.feedback.Subject?.trim() && this.feedback.Comment?.trim()) {
      if (this.feedback.FeedbackID) {
        // Actualizar feedback existente
        this.feedbackService
          .updateFeedback(this.feedback.FeedbackID, this.feedback)
          .subscribe(() => {
            const index = this.feedbacks.findIndex(
              (feedback) => feedback.FeedbackID === this.feedback.FeedbackID
            );
            this.feedbacks[index] = this.feedback;
  
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Retroalimentación actualizada',
              life: 3000,
            });
  
            this.resetDialog();
          });
      } else {
        // Crear nueva retroalimentación
        this.feedbackService
          .postFeedback(this.feedback)
          .subscribe((newFeedback) => {
            this.feedbacks.push(newFeedback);
  
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Retroalimentación creada',
              life: 3000,
            });
  
            this.resetDialog();
          });
      }
  
      // Actualizar lista de feedbacks
      this.feedbacks = [...this.feedbacks];
    }
  }
  
  // Método auxiliar para resetear el formulario y cerrar el diálogo
  resetDialog() {
    this.feedbackDialog = false;
    this.feedback = {};
    this.submitted = false;
  }
  

  saveNewComment() {
    if (this.newComment.trim()) {
      // Lógica para guardar el nuevo comentario
      const commentToSave = {
        FeedbackID: this.selectedFeedback.FeedbackID,
        Comment: this.newComment,
      };
      this.commentFeedbackService.postCommentFeedback(commentToSave).subscribe(
        () => {
          this.loadComments(this.selectedFeedback.FeedbackID); // Recargar comentarios
          this.newComment = ''; // Limpiar el editor
          this.showDetalles = false; // Ocultar el editor
        },
        (error) => {
          console.error('Error al guardar el comentario:', error);
        }
      );
    }
  }
  
  cancelNewComment() {
    this.newComment = ''; // Limpiar el editor
    this.showDetalles = false; // Ocultar el editor
  }

  sanitizeComment(feedback: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(feedback);
  }
}
