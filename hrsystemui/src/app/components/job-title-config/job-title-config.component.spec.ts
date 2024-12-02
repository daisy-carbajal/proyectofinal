import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleConfigComponent } from './job-title-config.component';

describe('JobTitleConfigComponent', () => {
  let component: JobTitleConfigComponent;
  let fixture: ComponentFixture<JobTitleConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitleConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobTitleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
