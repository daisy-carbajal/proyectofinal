import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaViewComponent } from './da-view.component';

describe('DaViewComponent', () => {
  let component: DaViewComponent;
  let fixture: ComponentFixture<DaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
