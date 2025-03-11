import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizationChartComponent } from './organization-chart.component';

describe('OrganizationChartComponent', () => {
  let component: OrganizationChartComponent;
  let fixture: ComponentFixture<OrganizationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationChartComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});