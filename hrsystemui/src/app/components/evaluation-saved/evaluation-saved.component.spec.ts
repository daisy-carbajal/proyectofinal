import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EvaluationSavedComponent } from './evaluation-saved.component';

describe('EvaluationSavedComponent', () => {
  let component: EvaluationSavedComponent;
  let fixture: ComponentFixture<EvaluationSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationSavedComponent, RouterTestingModule], // Simula la navegación en pruebas unitarias
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting(), // Proporciona HttpClient en pruebas
        {
          provide: ActivatedRoute,  // Mock de ActivatedRoute si se usa en el componente
          useValue: {
            paramMap: of({ get: () => 'test-id' }),
            snapshot: { paramMap: { get: () => 'test-id' } }
          }
        }
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(EvaluationSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});