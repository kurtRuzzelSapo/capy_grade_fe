import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopnavComponent } from '../../../../shared/topnav/topnav.component';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
@Component({
  selector: 'app-dashboard-student',
  standalone: true,
  imports: [RouterModule, TopnavComponent, SidenavComponent],
  templateUrl: './dashboard.student.component.html',
  styleUrls: ['./dashboard.student.component.css']
})
export class DashboardStudentComponent {
  constructor() {}
}
