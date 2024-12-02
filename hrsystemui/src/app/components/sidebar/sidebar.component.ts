import { Component, Injectable, ViewChild, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    RouterModule,
    TieredMenuModule,
    CommonModule,
  ],
})
@Injectable({
  providedIn: 'root',
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Input() staticSidebar: boolean = false;
  sidebarVisible: boolean = false;

  toggleStaticSidebar() {
    this.staticSidebar = !this.staticSidebar; // Alternar el estado
  }

  closeCallback(event: any) {
    this.sidebarVisible = false;
  }

  firstName: string = '';
  lastName: string = '';
  loggedUserId: number | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserFirstandLastName().subscribe({
      next: (data) => {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
      },
      error: (err) =>
        console.error('Error fetching user name and surname:', err),
    });

    this.loggedUserId = this.authService.getUserId();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      console.log('Sesión cerrada');
      this.router.navigate(['/login']);
    });
  }

  goToUserProfile(loggedUserId: number): void {
    console.log('Navigating to profile ID:', loggedUserId);
    this.router.navigate(['/home/profile', loggedUserId], { replaceUrl: true });
  }

  goToSettings(): void {
    console.log('Navigating to Settings');
    this.router.navigate(['/home/settings'], { replaceUrl: true });
  }

  items = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        if (this.loggedUserId !== null) {
          this.goToUserProfile(this.loggedUserId);
        } else {
          console.error('User  ID is null');
        }
      },
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => this.goToSettings(),
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];
}