import { Component, Injectable, ViewChild, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { UserViewComponent } from '../user-view/user-view.component';
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
    UserViewComponent,
    RouterModule,
    TieredMenuModule,
  ],
})
@Injectable({
  providedIn: 'root',
})
export class SidebarComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;

  firstName: string = '';
  lastName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserFirstandLastName().subscribe({
        next: (data) => {
            this.firstName = data.firstName;
            this.lastName = data.lastName;
        },
        error: (err) => console.error('Error fetching user name and surname:', err)
    });
}

  logout(): void {
    this.authService.logout().subscribe(() => {
      console.log('Sesión cerrada');
      this.router.navigate(['/login']);
    });
  }

  items = [
    { label: 'Perfil', icon: 'pi pi-user' /*command: () => this.verPerfil()*/ },
    {
      label: 'Configuración',
      icon: 'pi pi-cog' /*command: () => this.abrirConfiguracion()*/,
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out', command: () => this.logout(),
    },
  ];
}
