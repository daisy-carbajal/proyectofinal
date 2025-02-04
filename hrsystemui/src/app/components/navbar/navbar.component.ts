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
import * as Sentry from "@sentry/angular";

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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  showButton: boolean = false;
  currentUrl: string = '';

  constructor(private router: Router) {
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
              this.router.navigate(['/home','incident','new']);
            },
          },
          {
            label: 'Evaluación',
            icon: 'pi pi-file-edit',
            command: () => {
              this.router.navigate(['/home','evaluation','new']);
            },
          },
          {
            label: 'Acción Disciplinaria',
            icon: 'pi pi-file',
            command: () => {
              this.router.navigate(['/home','da','new']);
            },
          },
          {
            label: 'Retroalimentación',
            icon: 'pi pi-comments',
            command: () => {
              this.router.navigate(['/home','feedback']);
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

  throwError() {
    try {
      throw new Error("Test error from HeaderComponent");
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error enviado a Sentry:", error);
    }
  }

}
