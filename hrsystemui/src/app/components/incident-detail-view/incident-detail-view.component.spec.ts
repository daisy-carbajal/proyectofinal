import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailViewComponent } from './incident-detail-view.component';

describe('IncidentDetailViewComponent', () => {
  let component: IncidentDetailViewComponent;
  let fixture: ComponentFixture<IncidentDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncidentDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
