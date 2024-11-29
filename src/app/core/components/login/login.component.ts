import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../service/account.service';
// Fixing the import path for DialogContentComponent
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';


interface Login {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly dataService = inject(AccountService);

  loginForm: FormGroup<Login> = new FormGroup<Login>({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  })

  constructor(private dialog: MatDialog) {}

  handleLogin() {
    if (this.loginForm.valid) {
      this.dataService.postRequest('login', this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          this.openDialog(response.message);
          window.sessionStorage.setItem('user', JSON.stringify(response.data));

          const role = response.data?.role;
          if (role === 'STUDENT') {
            console.log('Navigating to student dashboard...');
            setTimeout(() => {
              this.router.navigate(['/dashboard/student'])
                .then(() => console.log('Navigation successful'))
                .catch(err => console.error('Navigation failed:', err));
            }, 2000);
          } else if (role === 'TEACHER') {
            console.log('Navigating to teacher dashboard...');
            setTimeout(() => {
              this.router.navigate(['/dashboard/teacher'])
                .then(() => console.log('Navigation successful'))
                .catch(err => console.error('Navigation failed:', err));
            }, 2000);
          }
        },
        error: (error) => {
          console.log(error);
          this.openDialog(error.error.message);
        }
      });
    }
  }

  openDialog(message: string) {
    this.dialog.open(DialogContentComponent, {
      data: { message },
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: 'top-dialog',
    });
  }
}
