import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChangeManagementComponent } from './employee-change-management.component';

describe('EmployeeChangeManagementComponent', () => {
  let component: EmployeeChangeManagementComponent;
  let fixture: ComponentFixture<EmployeeChangeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChangeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeChangeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
