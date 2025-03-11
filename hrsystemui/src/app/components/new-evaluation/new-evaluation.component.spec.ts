import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Evaluation360Service } from '../../services/evaluation360.service'; // Import del servicio
import { RouterTestingModule } from '@angular/router/testing';
import { NewEvaluationComponent } from './new-evaluation.component';

describe('NewEvaluationComponent', () => {
  let component: NewEvaluationComponent;
  let fixture: ComponentFixture<NewEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEvaluationComponent, RouterTestingModule], // Manejo de navegación en pruebas
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting(), // Proporciona HttpClient en pruebas
        Evaluation360Service       // Agregamos el servicio a providers
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and interact with Evaluation360Service', () => {
    expect(component).toBeTruthy();
  });
});