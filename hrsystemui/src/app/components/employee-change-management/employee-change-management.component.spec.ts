import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // <-- Asegúrate de importar esto
import { EmployeeChangeManagementComponent } from './employee-change-management.component';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta según corresponda

describe('EmployeeChangeManagementComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeChangeManagementComponent],
    providers: [AuthService, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmployeeChangeManagementComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});