import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TopnavComponent } from '../../../../shared/topnav/topnav.component';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
@Component({
  selector: 'app-dashboard.teacher',
  standalone: true,
  imports: [ RouterModule ,TopnavComponent, SidenavComponent],
  templateUrl: './dashboard.teacher.component.html',
  styleUrl: './dashboard.teacher.component.css'
})
export class DashboardTeacherComponent {

}
