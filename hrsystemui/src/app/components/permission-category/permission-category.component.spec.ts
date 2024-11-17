import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionCategoryComponent } from './permission-category.component';

describe('PermissionCategoryComponent', () => {
  let component: PermissionCategoryComponent;
  let fixture: ComponentFixture<PermissionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
