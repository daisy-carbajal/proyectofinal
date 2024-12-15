import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
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
import { NewIncidentComponent } from './components/new-incident/new-incident.component';
import { IncidentViewComponent } from './components/incident-view/incident-view.component';
import { NewEvaluationComponent } from './components/new-evaluation/new-evaluation.component';
import { EvaluationConfigurationComponent } from './components/evaluation-configuration/evaluation-configuration.component';
import { RolePermissionDetailViewComponent } from './components/role-permission-detail-view/role-permission-detail-view.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { PermissionsConfigComponent } from './components/permissions-config/permissions-config.component';
import { EvaluationSavedComponent } from './components/evaluation-saved/evaluation-saved.component';
import { EmployeeChangeManagementComponent } from './components/employee-change-management/employee-change-management.component';
import { EmployeeChangeDetailViewComponent } from './components/employee-change-detail-view/employee-change-detail-view.component';
import { IncidentDetailViewComponent } from './components/incident-detail-view/incident-detail-view.component';
import { EvaluationSavedDetailViewComponent } from './components/evaluation-saved-detail-view/evaluation-saved-detail-view.component';
import { EvaluationViewComponent } from './components/evaluation-view/evaluation-view.component';
import { EvaluationRecordDetailEditComponent } from './components/evaluation-record-detail-edit/evaluation-record-detail-edit.component';
import { NewDAComponent } from './components/new-da/new-da.component';
import { NewActionPlanComponent } from './components/new-action-plan/new-action-plan.component';
import { DaConfigurationComponent } from './components/da-configuration/da-configuration.component';
import { DisciplinaryActionViewComponent } from './components/disciplinary-action-view/disciplinary-action-view.component';
import { FeedbackViewComponent } from './components/feedback-view/feedback-view.component';
import { ActionPlanViewComponent } from './components/action-plan-view/action-plan-view.component';
import { OrganizationChartComponent } from './components/organization-chart/organization-chart.component';
import { JobTitleConfigComponent } from './components/job-title-config/job-title-config.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DaDetailViewComponent } from './components/da-detail-view/da-detail-view.component';
import { ActionPlanDetailViewComponent } from './components/action-plan-detail-view/action-plan-detail-view.component';
import { Evaluation360ViewComponent } from './components/evaluation360-view/evaluation360-view.component';
import { Evaluation360RecordViewComponent } from './components/evaluation360-record-view/evaluation360-record-view.component';
import { Evaluation360DetailViewComponent } from './components/evaluation360-detail-view/evaluation360-detail-view.component';

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
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'profile/:id', component: ProfileViewComponent },
      {
        path: 'user',
        children: [
          { path: '', component: UserViewComponent },
          {
            path: 'change',
            children: [
              { path: '', component: EmployeeChangeManagementComponent },
              { path: ':id', component: EmployeeChangeDetailViewComponent },
            ],
          },
          { path: 'org-chart', component: OrganizationChartComponent },
          { path: ':id', component: UserDetailViewComponent },
        ],
      },
      {
        path: 'jobtitle',
        children: [
          { path: '', component: JobTitleViewComponent },
          { path: 'config', component: JobTitleConfigComponent },
        ],
      },
      { path: 'department', component: DepartmentViewComponent },
      {
        path: 'roles',
        children: [
          { path: '', component: RolesViewComponent },
          { path: 'permissions', component: PermissionsConfigComponent },
          { path: ':id', component: RolePermissionDetailViewComponent },
        ],
      },
      {
        path: 'incident',
        children: [
          { path: '', component: IncidentViewComponent },
          { path: 'new', component: NewIncidentComponent },
          { path: 'details/:id', component: IncidentDetailViewComponent },
        ],
      },
      {
        path: 'evaluation',
        children: [
          { path: 'saved', component: EvaluationSavedComponent },
          { path: 'config', component: EvaluationConfigurationComponent },
          { path: 'records', component: EvaluationViewComponent },
          { path: 'new', component: NewEvaluationComponent },
          {
            path: 'eval360',
            children: [
              { path: '', component: Evaluation360ViewComponent },
              { path: 'list/:id', component: EvaluationViewComponent },
              { path: 'records/:id', component: EvaluationRecordDetailEditComponent },
            ],
          },
          { path: 'saved/:id', component: EvaluationSavedDetailViewComponent },
          {
            path: 'details/:id',
            component: EvaluationRecordDetailEditComponent,
          },
        ],
      },
      {
        path: 'da',
        children: [
          { path: '', component: DisciplinaryActionViewComponent },
          { path: 'new', component: NewDAComponent },
          { path: 'config', component: DaConfigurationComponent },
          { path: 'details/:id', component: DaDetailViewComponent },
        ],
      },
      {
        path: 'action-plan',
        children: [
          { path: '', component: ActionPlanViewComponent },
          { path: 'new', component: NewActionPlanComponent },
          { path: 'details/:id', component: ActionPlanDetailViewComponent },
        ],
      },
      {
        path: 'feedback',
        children: [{ path: '', component: FeedbackViewComponent }],
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

export const appRoutingProviders = [provideRouter(routes)];
