import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FeedbackViewComponent } from './feedback-view.component';

describe('FeedbackViewComponent', () => {
  let component: FeedbackViewComponent;
  let fixture: ComponentFixture<FeedbackViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient para producción
        provideHttpClientTesting() // Proporciona HttpClient para pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
