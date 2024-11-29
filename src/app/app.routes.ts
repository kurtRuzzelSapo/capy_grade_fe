import { Routes } from '@angular/router';
import { LandingComponent } from './core/components/landing/landing.component';
import { SignupStudentComponent } from './core/components/signup.student/signup.student.component';
import { SignupTeacherComponent } from './core/components/signup.teacher/signup.teacher.component';
import { LoginComponent } from './core/components/login/login.component';
// import { mainGuard } from './auth/auth.guard';
import { DashboardStudentComponent } from './core/components/student/dashboard.student/dashboard.student.component';
import { DashboardTeacherComponent } from './core/components/teacher/dashboard.teacher/dashboard.teacher.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent},
  { path: 'signup/student', component: SignupStudentComponent },
  { path: 'signup/teacher', component: SignupTeacherComponent },
  { path: 'dashboard/student', component:  DashboardStudentComponent },
  { path: 'dashboard/teacher', component:  DashboardTeacherComponent },

];
