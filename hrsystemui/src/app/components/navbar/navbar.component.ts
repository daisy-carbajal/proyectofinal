import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Router, NavigationEnd } from '@angular/router';
import { OverlayPanelModule  } from 'primeng/overlaypanel';
import { NotificationService } from '../../services/notification-service.service';
import { AuthService } from '../../services/auth.service';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    SidebarComponent,
    InputIconModule,
    IconFieldModule,
    FormsModule,
    PanelModule,
    CardModule,
    ButtonModule,
    MenuModule,
    OverlayPanelModule ,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  showButton: boolean = false;
  currentUrl: string = '';
  unreadCount: number = 0;
  notifications: any[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.loadNotifications();
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Nuevo',
        items: [
          {
            label: 'Incidente',
            icon: 'pi pi-file-plus',
            command: () => {
              this.router.navigate(['/home', 'incident', 'new']);
            },
          },
          {
            label: 'Evaluación',
            icon: 'pi pi-file-edit',
            command: () => {
              this.router.navigate(['/home', 'evaluation', 'new']);
            },
          },
          {
            label: 'Acción Disciplinaria',
            icon: 'pi pi-file',
            command: () => {
              this.router.navigate(['/home', 'da', 'new']);
            },
          },
          {
            label: 'Retroalimentación',
            icon: 'pi pi-comments',
            command: () => {
              this.router.navigate(['/home', 'feedback']);
            },
          },
        ],
      },
    ];

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showButton = event.url === '/home';
      }
    });
  }

  loadNotifications(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.notificationService.getNotificationsByUserId(userId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.length;
      },
      error: (err) => console.error('Error al cargar notificaciones', err),
    });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.NotificationID !== id);
        this.unreadCount = this.notifications.length;
      },
      error: (err) => console.error('Error al marcar notificación como leída', err),
    });
  }

  throwError() {
    try {
      throw new Error('Test error from HeaderComponent');
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error enviado a Sentry:', error);
    }
  }
}
