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
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token = '';
  tempPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  resetPassword() {
    console.log("Datos enviados al servidor:", {
      token: this.token,
      tempPassword: this.tempPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });

    this.authService.resetPassword(this.token, this.tempPassword, this.newPassword, this.confirmPassword).subscribe(
      (response) => {
        console.log('Contraseña restablecida exitosamente', response);
        alert('Contraseña restablecida exitosamente');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al restablecer la contraseña', error);
        alert('Error al restablecer la contraseña');
      }
    );
  }
}
