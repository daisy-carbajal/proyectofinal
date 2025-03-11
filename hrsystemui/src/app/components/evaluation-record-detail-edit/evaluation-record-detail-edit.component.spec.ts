import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EvaluationRecordDetailEditComponent } from './evaluation-record-detail-edit.component';

describe('EvaluationRecordDetailEditComponent', () => {
  let component: EvaluationRecordDetailEditComponent;
  let fixture: ComponentFixture<EvaluationRecordDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationRecordDetailEditComponent, RouterTestingModule], // Maneja navegación en pruebas
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(EvaluationRecordDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});