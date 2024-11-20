import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChangeViewComponent } from './employee-change-view.component';

describe('EmployeeChangeViewComponent', () => {
  let component: EmployeeChangeViewComponent;
  let fixture: ComponentFixture<EmployeeChangeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChangeViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeChangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
