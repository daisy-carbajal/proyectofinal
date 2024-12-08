import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaDetailViewComponent } from './da-detail-view.component';

describe('DaDetailViewComponent', () => {
  let component: DaDetailViewComponent;
  let fixture: ComponentFixture<DaDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
