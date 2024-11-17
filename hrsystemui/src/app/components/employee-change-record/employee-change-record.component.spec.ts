import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChangeRecordComponent } from './employee-change-record.component';

describe('EmployeeChangeRecordComponent', () => {
  let component: EmployeeChangeRecordComponent;
  let fixture: ComponentFixture<EmployeeChangeRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChangeRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeChangeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
