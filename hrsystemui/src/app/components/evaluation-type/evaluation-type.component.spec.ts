import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EvaluationTypeComponent } from './evaluation-type.component';

describe('EvaluationTypeComponent', () => {
  let component: EvaluationTypeComponent;
  let fixture: ComponentFixture<EvaluationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationTypeComponent],
      providers: [
        HttpClient,
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
