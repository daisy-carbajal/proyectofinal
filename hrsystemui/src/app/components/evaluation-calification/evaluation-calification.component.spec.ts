import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCalificationComponent } from './evaluation-calification.component';

describe('EvaluationCalificationComponent', () => {
  let component: EvaluationCalificationComponent;
  let fixture: ComponentFixture<EvaluationCalificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationCalificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationCalificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
