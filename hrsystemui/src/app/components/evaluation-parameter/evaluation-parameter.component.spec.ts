import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationParameterComponent } from './evaluation-parameter.component';

describe('EvaluationParameterComponent', () => {
  let component: EvaluationParameterComponent;
  let fixture: ComponentFixture<EvaluationParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationParameterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
