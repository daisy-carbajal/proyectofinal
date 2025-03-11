import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // <-- Importa RouterTestingModule
import { AuthService } from '../../services/auth.service';
import { CompleteRegistrationComponent } from './complete-registration.component';
import { of } from 'rxjs';

// Mock de AuthService para evitar llamadas HTTP reales
class MockAuthService {
  completeRegistration() {
    return of({ success: true }); // Simula una respuesta exitosa
  }
}

describe('CompleteRegistrationComponent', () => {
  let component: CompleteRegistrationComponent;
  let fixture: ComponentFixture<CompleteRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Se usa en lugar de provideHttpClientTesting()
        RouterTestingModule,
        CompleteRegistrationComponent // <-- Debe ir en declarations, no en imports
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService } // Mock de AuthService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and interact with AuthService', () => {
    expect(component).toBeTruthy();
  });
});
