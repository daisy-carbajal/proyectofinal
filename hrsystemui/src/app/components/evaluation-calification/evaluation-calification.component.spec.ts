import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EvaluationCalificationComponent } from './evaluation-calification.component';

describe('EvaluationCalificationComponent', () => {
  let component: EvaluationCalificationComponent;
  let fixture: ComponentFixture<EvaluationCalificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationCalificationComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationCalificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});