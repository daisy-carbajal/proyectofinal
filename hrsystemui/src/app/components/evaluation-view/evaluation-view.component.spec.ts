import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // <-- Importa RouterTestingModule
import { EvaluationViewComponent } from './evaluation-view.component';

describe('EvaluationViewComponent', () => {
  let component: EvaluationViewComponent;
  let fixture: ComponentFixture<EvaluationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EvaluationViewComponent, 
        RouterTestingModule // <-- Agrega RouterTestingModule aquí
      ],
      providers: [
        provideHttpClient(),       
        provideHttpClientTesting() 
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
