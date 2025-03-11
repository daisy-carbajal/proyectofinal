import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EvaluationParameterComponent } from './evaluation-parameter.component';

describe('EvaluationParameterComponent', () => {
  let component: EvaluationParameterComponent;
  let fixture: ComponentFixture<EvaluationParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationParameterComponent, RouterTestingModule], // Simula la navegación en pruebas unitarias
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
    
    fixture = TestBed.createComponent(EvaluationParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});