import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // <-- Importa RouterTestingModule
import { RolePermissionDetailViewComponent } from './role-permission-detail-view.component';

describe('RolePermissionDetailViewComponent', () => {
  let component: RolePermissionDetailViewComponent;
  let fixture: ComponentFixture<RolePermissionDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RolePermissionDetailViewComponent, 
        RouterTestingModule // <-- Agrega RouterTestingModule aquí
      ],
      providers: [
        provideHttpClient(),       
        provideHttpClientTesting() 
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolePermissionDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
