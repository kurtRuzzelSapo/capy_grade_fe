import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css'
})
export class TopnavComponent  implements OnInit{
  user: any;
  constructor(private accountService: AccountService, private router: Router) {}
  ngOnInit(): void {
    const user = window.sessionStorage.getItem('user');
    this.user = user ? JSON.parse(user) : null;
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}
