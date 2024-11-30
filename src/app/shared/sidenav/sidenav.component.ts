import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../service/router.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  routes: any[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit() {
    const user = this.getUserFromSession(); // Get user from session
    const userRole = user?.role || 'intern'; // Fallback to 'intern' if role not found

    // Get routes based on the retrieved role
    this.routes = this.routeService.getRoutesForRole(userRole);
  }

  // Helper function to get the user from sessionStorage
  getUserFromSession(): any {
    const userString = window.sessionStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  getIconPath(icon: string): string {
    const icons = {
      'food-icon': 'M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z',
      'salary-icon': 'M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z',
      'docs-icon': 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z',
      'help-icon': 'M18 10a8 8 0 11-16 0 8 8 0 0116 0z',
    } as { [key: string]: string };
    return icons[icon] || icons['help-icon'];
  }
}
