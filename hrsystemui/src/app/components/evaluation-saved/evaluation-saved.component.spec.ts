import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationSavedComponent } from './evaluation-saved.component';

describe('EvaluationSavedComponent', () => {
  let component: EvaluationSavedComponent;
  let fixture: ComponentFixture<EvaluationSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationSavedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
