import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Evaluation360Service } from './services/evaluation360.service';
import { DisciplinaryActionTaskService } from './services/disciplinary-action-task.service';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Importa AppComponent aquí en lugar de declararlo
        HttpClientModule, 
        RouterModule.forRoot([])
      ],
      providers: [
        Evaluation360Service, 
        DisciplinaryActionTaskService, 
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();
  });

  it('should create the app and interact with services', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'hrsystemui' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('hrsystemui');
  });
});
