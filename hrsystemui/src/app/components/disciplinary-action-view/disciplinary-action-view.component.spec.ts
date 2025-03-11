import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DisciplinaryActionViewComponent } from './disciplinary-action-view.component';

describe('DisciplinaryActionViewComponent', () => {
  let component: DisciplinaryActionViewComponent;
  let fixture: ComponentFixture<DisciplinaryActionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinaryActionViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisciplinaryActionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});