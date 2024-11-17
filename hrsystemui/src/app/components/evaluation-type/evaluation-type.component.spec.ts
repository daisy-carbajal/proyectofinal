import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationTypeComponent } from './evaluation-type.component';

describe('EvaluationTypeComponent', () => {
  let component: EvaluationTypeComponent;
  let fixture: ComponentFixture<EvaluationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
