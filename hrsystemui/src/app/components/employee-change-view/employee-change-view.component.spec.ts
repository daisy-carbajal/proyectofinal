import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EmployeeChangeViewComponent } from './employee-change-view.component';

describe('EmployeeChangeViewComponent', () => {
  let component: EmployeeChangeViewComponent;
  let fixture: ComponentFixture<EmployeeChangeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChangeViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeChangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
