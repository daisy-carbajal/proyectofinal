import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaryActionViewComponent } from './disciplinary-action-view.component';

describe('DisciplinaryActionViewComponent', () => {
  let component: DisciplinaryActionViewComponent;
  let fixture: ComponentFixture<DisciplinaryActionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinaryActionViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisciplinaryActionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
