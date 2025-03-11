import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PermissionCategoryComponent } from './permission-category.component';

describe('PermissionCategoryComponent', () => {
  let component: PermissionCategoryComponent;
  let fixture: ComponentFixture<PermissionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionCategoryComponent],
      providers: [
        provideHttpClient(),       // Proporciona HttpClient en producción
        provideHttpClientTesting() // Proporciona HttpClient en pruebas
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
