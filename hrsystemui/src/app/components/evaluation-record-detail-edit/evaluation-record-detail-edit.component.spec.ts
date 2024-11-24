import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationRecordDetailEditComponent } from './evaluation-record-detail-edit.component';

describe('EvaluationRecordDetailEditComponent', () => {
  let component: EvaluationRecordDetailEditComponent;
  let fixture: ComponentFixture<EvaluationRecordDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationRecordDetailEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationRecordDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
