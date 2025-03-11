import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DaReasonViewComponent } from './da-reason-view.component';

describe('DaReasonViewComponent', () => {
  let component: DaReasonViewComponent;
  let fixture: ComponentFixture<DaReasonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaReasonViewComponent, RouterTestingModule], // Manejo de navegación en pruebas
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
    }).compileComponents();
    
    fixture = TestBed.createComponent(DaReasonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
