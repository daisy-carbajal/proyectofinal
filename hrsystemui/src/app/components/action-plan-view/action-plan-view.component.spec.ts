import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanViewComponent } from './action-plan-view.component';

describe('ActionPlanViewComponent', () => {
  let component: ActionPlanViewComponent;
  let fixture: ComponentFixture<ActionPlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
