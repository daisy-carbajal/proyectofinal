import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { JobTitleViewComponent } from './job-title-view.component';

describe('JobTitleViewComponent', () => {
  let component: JobTitleViewComponent;
  let fixture: ComponentFixture<JobTitleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitleViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobTitleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});