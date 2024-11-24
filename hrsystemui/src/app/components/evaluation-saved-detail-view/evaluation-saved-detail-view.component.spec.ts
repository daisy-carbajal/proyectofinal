import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationSavedDetailViewComponent } from './evaluation-saved-detail-view.component';

describe('EvaluationSavedDetailViewComponent', () => {
  let component: EvaluationSavedDetailViewComponent;
  let fixture: ComponentFixture<EvaluationSavedDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationSavedDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationSavedDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
