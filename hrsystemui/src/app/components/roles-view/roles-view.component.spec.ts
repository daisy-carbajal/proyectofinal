import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RolesViewComponent } from './roles-view.component';

describe('RolesViewComponent', () => {
  let component: RolesViewComponent;
  let fixture: ComponentFixture<RolesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesViewComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});