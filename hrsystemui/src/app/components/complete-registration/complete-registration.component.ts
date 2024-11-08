import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [
    CheckboxModule,
    FloatLabelModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    DividerModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [MessageService, AuthService],
  templateUrl: './complete-registration.component.html',
  styleUrl: './complete-registration.component.css',
})
export class CompleteRegistrationComponent {
  tempPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  completeRegistration() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.authService
      .completeRegistration(
        this.token,
        this.tempPassword,
        this.newPassword,
        this.confirmPassword
      )
      .subscribe(
        (response) => {
          console.log('Registro completado:', response);
          alert('Registro completado con éxito. Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error en el registro:', error);
          alert(
            error.error.message || 'Hubo un error al completar el registro.'
          );
        }
      );
  }
}
