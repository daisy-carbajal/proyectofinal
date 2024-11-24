import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaConfigurationComponent } from './da-configuration.component';

describe('DaConfigurationComponent', () => {
  let component: DaConfigurationComponent;
  let fixture: ComponentFixture<DaConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
