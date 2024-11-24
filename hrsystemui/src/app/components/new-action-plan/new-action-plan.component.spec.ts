import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActionPlanComponent } from './new-action-plan.component';

describe('NewActionPlanComponent', () => {
  let component: NewActionPlanComponent;
  let fixture: ComponentFixture<NewActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewActionPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
