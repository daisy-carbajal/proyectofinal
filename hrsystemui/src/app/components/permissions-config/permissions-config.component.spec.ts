import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsConfigComponent } from './permissions-config.component';

describe('PermissionsConfigComponent', () => {
  let component: PermissionsConfigComponent;
  let fixture: ComponentFixture<PermissionsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
