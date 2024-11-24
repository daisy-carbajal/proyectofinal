import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaReasonViewComponent } from './da-reason-view.component';

describe('DaReasonViewComponent', () => {
  let component: DaReasonViewComponent;
  let fixture: ComponentFixture<DaReasonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaReasonViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaReasonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
