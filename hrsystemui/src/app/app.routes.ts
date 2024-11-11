import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { JobTitleViewComponent } from './components/job-title-view/job-title-view.component';
import { DepartmentViewComponent } from './components/department-view/department-view.component';
import { RolesViewComponent } from './components/roles-view/roles-view.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';
import { UserDetailViewComponent } from './components/userdetailview/userdetailview.component';
import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { NewDAComponent } from './components/new-da/new-da.component';
import { DisciplinaryActionViewComponent } from './components/disciplinary-action-view/disciplinary-action-view.component';
import { NewIncidentComponent } from './components/new-incident/new-incident.component';
import { IncidentViewComponent } from './components/incident-view/incident-view.component';
import { NewEvaluationComponent } from './components/new-evaluation/new-evaluation.component';
import { EvaluationViewComponent } from './components/evaluation-view/evaluation-view.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'complete-registration',
    component: CompleteRegistrationComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
  },
  {
    path: 'new-da',
    component: NewDAComponent,
  },
  {
    path: 'new-incident',
    component: NewIncidentComponent,
  },
  {
    path: 'new-evaluation',
    component: NewEvaluationComponent,
  },
  {
    path: 'da',
    component: DisciplinaryActionViewComponent,
  },
  {
    path: 'evaluation',
    component: EvaluationViewComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: WelcomeComponent },
      {
        path: 'user',
        component: UserViewComponent,
      },
      { path: 'user/:id', component: UserDetailViewComponent },
      { path: 'jobtitle', component: JobTitleViewComponent },
      { path: 'department', component: DepartmentViewComponent },
      { path: 'roles', component: RolesViewComponent },
      { path: 'incident', component: IncidentViewComponent }
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

export const appRoutingProviders = [provideRouter(routes)];
