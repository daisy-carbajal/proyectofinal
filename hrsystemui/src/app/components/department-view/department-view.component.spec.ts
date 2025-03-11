import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DepartmentViewComponent } from './department-view.component';

describe('DepartmentViewComponent', () => {
  let component: DepartmentViewComponent;
  let fixture: ComponentFixture<DepartmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

