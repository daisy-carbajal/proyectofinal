import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserViewComponent } from './user-view.component';

describe('UserViewComponent', () => {
  let component: UserViewComponent;
  let fixture: ComponentFixture<UserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewComponent],
      providers: [
        HttpClient,
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting(), // Proporciona HttpClient en pruebas
        {
          provide: ActivatedRoute, // Mock de ActivatedRoute
          useValue: {
            paramMap: of({ get: () => 'test-id' }) // Simulación de parámetro de ruta
          }
        }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
