import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { NotificationSocketService } from './../../services/notification-socket.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MessagesModule, ToastModule, RippleModule],
  providers: [NotificationSocketService, AuthService, MessageService],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'] // Cambié `styleUrl` a `styleUrls`
})
export class NotificationComponent implements OnInit, OnDestroy {

  messages: Message[] = []; // Inicializamos como un array vacío
  loggedUserID: number | null = null;

  constructor(
    private messageService: MessageService,
    private notificationSocketService: NotificationSocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loggedUserID = this.authService.getUserId();

    if (this.loggedUserID && typeof this.loggedUserID === 'number') {
      this.notificationSocketService.registerUser(this.loggedUserID);
    } else {
      console.error('El ID de usuario no es válido:', this.loggedUserID);
    }

    // Escuchar notificaciones en tiempo real
    this.notificationSocketService.onNewNotification((data) => {
      this.messageService.add({
        severity: 'info',
        summary: data.title,
        detail: data.message,
        life: 5000,
        sticky: true
      });
    });
  }

  ngOnDestroy() {
    this.notificationSocketService.disconnect();
  }
}
