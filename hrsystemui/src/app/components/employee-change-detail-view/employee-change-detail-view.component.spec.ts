import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChangeDetailViewComponent } from './employee-change-detail-view.component';

describe('EmployeeChangeDetailViewComponent', () => {
  let component: EmployeeChangeDetailViewComponent;
  let fixture: ComponentFixture<EmployeeChangeDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChangeDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeChangeDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
