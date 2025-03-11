import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // <-- Importa RouterTestingModule
import { UserDetailViewComponent } from './userdetailview.component';

describe('UserDetailViewComponent', () => {
  let component: UserDetailViewComponent;
  let fixture: ComponentFixture<UserDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserDetailViewComponent, 
        RouterTestingModule // <-- Agrega RouterTestingModule aquí
      ],
      providers: [
        provideHttpClient(),       
        provideHttpClientTesting() 
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});