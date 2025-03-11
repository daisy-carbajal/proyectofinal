import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NewIncidentComponent } from './new-incident.component';

describe('NewIncidentComponent', () => {
  let component: NewIncidentComponent;
  let fixture: ComponentFixture<NewIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewIncidentComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
                                                                        