import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EmployeeChangeDetailViewComponent } from './employee-change-detail-view.component';

describe('EmployeeChangeDetailViewComponent', () => {
  let component: EmployeeChangeDetailViewComponent;
  let fixture: ComponentFixture<EmployeeChangeDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChangeDetailViewComponent],
      providers: [
        provideHttpClient(),        // Proporciona HttpClient en producción
        provideHttpClientTesting(), // Proporciona HttpClient en pruebas
        {
          provide: ActivatedRoute,  // Mock de ActivatedRoute si se usa en el componente
          useValue: {
            paramMap: of({ get: () => 'test-id' }),
            snapshot: { paramMap: { get: () => 'test-id' } }
          }
        }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeChangeDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});