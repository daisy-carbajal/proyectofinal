import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDetailViewComponent } from './feedback-detail-view.component';

describe('FeedbackDetailViewComponent', () => {
  let component: FeedbackDetailViewComponent;
  let fixture: ComponentFixture<FeedbackDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
