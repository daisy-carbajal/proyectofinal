import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanDetailViewComponent } from './action-plan-detail-view.component';

describe('ActionPlanDetailViewComponent', () => {
  let component: ActionPlanDetailViewComponent;
  let fixture: ComponentFixture<ActionPlanDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionPlanDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
