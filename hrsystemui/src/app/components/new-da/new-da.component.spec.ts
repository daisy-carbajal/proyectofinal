import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDAComponent } from './new-da.component';

describe('NewDAComponent', () => {
  let component: NewDAComponent;
  let fixture: ComponentFixture<NewDAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
