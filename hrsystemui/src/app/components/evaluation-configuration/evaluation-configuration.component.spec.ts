import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationConfigurationComponent } from './evaluation-configuration.component';

describe('EvaluationConfigurationComponent', () => {
  let component: EvaluationConfigurationComponent;
  let fixture: ComponentFixture<EvaluationConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
