import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionDetailViewComponent } from './role-permission-detail-view.component';

describe('RolePermissionDetailViewComponent', () => {
  let component: RolePermissionDetailViewComponent;
  let fixture: ComponentFixture<RolePermissionDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolePermissionDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
