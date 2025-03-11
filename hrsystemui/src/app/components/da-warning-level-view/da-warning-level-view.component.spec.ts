import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DaWarningLevelViewComponent } from './da-warning-level-view.component';

describe('DaWarningLevelViewComponent', () => {
  let component: DaWarningLevelViewComponent;
  let fixture: ComponentFixture<DaWarningLevelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaWarningLevelViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaWarningLevelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
