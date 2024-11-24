import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationRecordDetailReviewComponent } from './evaluation-record-detail-review.component';

describe('EvaluationRecordDetailReviewComponent', () => {
  let component: EvaluationRecordDetailReviewComponent;
  let fixture: ComponentFixture<EvaluationRecordDetailReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationRecordDetailReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationRecordDetailReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
