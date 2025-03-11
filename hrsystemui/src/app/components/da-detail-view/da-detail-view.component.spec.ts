import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DaDetailViewComponent } from './da-detail-view.component';

describe('DaDetailViewComponent', () => {
  let component: DaDetailViewComponent;
  let fixture: ComponentFixture<DaDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaDetailViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting(), // Proporciona HttpClient en pruebas
        {
          provide: ActivatedRoute,  // Mock de ActivatedRoute
          useValue: {
            paramMap: of({ get: () => 'test-id' }), // Simula parámetros de la ruta
            snapshot: { paramMap: { get: () => 'test-id' } } // Mock del snapshot
          }
        }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
