import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewDAComponent } from './new-da.component';

describe('NewDAComponent', () => {
  let component: NewDAComponent;
  let fixture: ComponentFixture<NewDAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDAComponent, RouterTestingModule], // Agregamos RouterTestingModule
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(NewDAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});