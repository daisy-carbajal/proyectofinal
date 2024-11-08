import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleViewComponent } from './job-title-view.component';

describe('JobTitleViewComponent', () => {
  let component: JobTitleViewComponent;
  let fixture: ComponentFixture<JobTitleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitleViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobTitleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
