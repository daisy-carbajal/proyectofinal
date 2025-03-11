import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewActionPlanComponent } from './new-action-plan.component';

describe('NewActionPlanComponent', () => {
  let component: NewActionPlanComponent;
  let fixture: ComponentFixture<NewActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewActionPlanComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});