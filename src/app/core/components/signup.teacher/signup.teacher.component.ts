import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

interface SignupTeacher {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  name: FormControl<string | null>;
}
@Component({
  selector: 'app-signup.teacher',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, CommonModule],
  templateUrl: './signup.teacher.component.html',
  styleUrl: './signup.teacher.component.css'
})
export class SignupTeacherComponent {
  signupForm: FormGroup<SignupTeacher> = new FormGroup<SignupTeacher>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', Validators.required)
  })

  constructor(private router: Router, private dataService: AccountService, private dialog: MatDialog) {}


  getErrorMessage(controlName: keyof SignupTeacher): string {
    const control = this.signupForm.get(controlName);

    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }

    if (controlName === 'email' && control?.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (controlName === 'password' && control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }

    return '';
  }

  hasError(controlName: keyof SignupTeacher): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }




    signupTeacher() {
      if (this.signupForm.valid) {
        this.dataService.postRequest('register/teacher', this.signupForm.value).subscribe({
          next: (response: any) => {
            this.openDialog(response.message);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            console.log(error);
            this.openDialog(error.error.message);
          }
        });
      }
    }

    // For now, just navigate to login
    openDialog(message: string) {
      this.dialog.open(DialogContentComponent, {
        data: { message },
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '200ms',
        panelClass: 'top-dialog',
      });
    }
}
