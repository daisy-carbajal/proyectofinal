import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEvaluationComponent } from './new-evaluation.component';

describe('NewEvaluationComponent', () => {
  let component: NewEvaluationComponent;
  let fixture: ComponentFixture<NewEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
