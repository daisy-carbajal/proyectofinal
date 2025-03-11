import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Manejo de navegación en pruebas
import { ActionPlanDetailViewComponent } from './action-plan-detail-view.component';

describe('ActionPlanDetailViewComponent', () => {
  let component: ActionPlanDetailViewComponent;
  let fixture: ComponentFixture<ActionPlanDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActionPlanDetailViewComponent, 
        RouterTestingModule // Simula la navegación en pruebas unitarias
      ],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(ActionPlanDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});