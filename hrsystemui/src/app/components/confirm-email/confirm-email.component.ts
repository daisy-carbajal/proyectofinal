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
  selector: 'app-confirm-email',
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
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css',
})
export class ConfirmEmailComponent {
  email: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  requestPasswordReset(): void {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        console.log('Correo de restablecimiento enviado:', response);
        alert(
          'Correo de restablecimiento enviado, revisa tu bandeja de entrada.'
        );
        this.router.navigate(['/reset-password']);
      },
      error: (error) => {
        console.error(
          'Error al solicitar restablecimiento de contraseña:',
          error
        );
        alert(
          'Hubo un error al solicitar el restablecimiento. Inténtalo nuevamente.'
        );
      },
    });
  }
}
