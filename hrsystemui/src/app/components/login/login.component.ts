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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
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
    RouterModule
  ],
  providers: [MessageService, AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  workEmail: string = '';
  password: string = '';
  rememberMe: boolean = false;

  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login() {
    const credentials = {
      workEmail: this.workEmail,
      password: this.password,
      rememberMe: this.rememberMe
    };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log("credentials:", credentials);
        this.messageService.add({
          severity: 'success',
          summary: 'Login exitoso',
          detail: response.message,
        });
        this.router.navigateByUrl(this.returnUrl); // Redirige al returnUrl después del login
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña incorrectos',
        });
      },
    });
  }
}
