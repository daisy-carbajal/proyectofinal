import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // <-- Importa RouterTestingModule
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta si es diferente
import { of } from 'rxjs';

// Mock de AuthService
class MockAuthService {
  getUserFirstandLastName() {
    return of({ firstName: 'Test', lastName: 'User' }); // Devuelve un usuario de prueba
  }
  getUserId() {
    return 123; // Devuelve un ID de usuario simulado
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NavbarComponent // <-- Debe ir en declarations, no en imports
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useClass: MockAuthService } // Usa un mock de AuthService
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});