import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailViewComponent } from './userdetailview.component';

describe('UserDetailViewComponent', () => {
  let component: UserDetailViewComponent;
  let fixture: ComponentFixture<UserDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
