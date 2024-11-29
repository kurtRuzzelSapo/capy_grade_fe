import { Routes } from '@angular/router';
import { LandingComponent } from './core/components/landing/landing.component';
import { SignupStudentComponent } from './core/components/signup.student/signup.student.component';
import { SignupTeacherComponent } from './core/components/signup.teacher/signup.teacher.component';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup/student', component: SignupStudentComponent },
  { path: 'signup/teacher', component: SignupTeacherComponent },
];
