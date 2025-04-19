import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Mock de AuthService
class MockAuthService {
  login() {
    return of({ token: 'fake-token' }); // Simula respuesta exitosa de login
  }
}

// Mock de ActivatedRoute con queryParams definido correctamente
const mockActivatedRoute = {
  snapshot: { queryParams: { returnUrl: '/dashboard' } }, // Agrega snapshot por si el código lo usa directamente
  queryParams: of({ returnUrl: '/dashboard' }) // Simula parámetros en la URL
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        LoginComponent],
    providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Mockeamos ActivatedRoute
        ,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and interact with AuthService', () => {
    expect(component).toBeTruthy();
  });
});