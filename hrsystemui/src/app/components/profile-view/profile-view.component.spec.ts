import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProfileViewComponent } from './profile-view.component';

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileViewComponent],
      providers: [
        HttpClient,                // HttpClient,
        provideHttpClient(),        // Proporciona HttpClient en producción
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
    
    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
