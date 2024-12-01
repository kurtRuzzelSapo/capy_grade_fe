import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../../../service/account.service';
import { ClassroomService } from '../../../../service/classroom.service';
import { CommonModule } from '@angular/common';

interface Classroom {
  name: FormControl<string | null>;
  start_time: FormControl<string | null>;
  end_time: FormControl<string | null>;
}

interface ClassroomResponse {
  id: number;
  name: string;
  schedule: string;
  teacherId: number;
}

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent implements OnInit {


  classrooms: any[] = [];

  ngOnInit(): void {
    const user = JSON.parse(window.sessionStorage.getItem('user') || '{}');
    this.classroomService.getClassrooms(user.id).subscribe({
      next: (response: any) => {
        this.classrooms = Array.isArray(response.data) ? response.data : [];
        console.log(this.classrooms);
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching classrooms', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });

  }

  classroomForm: FormGroup<Classroom> = new FormGroup<Classroom>({
    name: new FormControl('', Validators.required),
    start_time: new FormControl('', Validators.required),
    end_time: new FormControl('', Validators.required)
  })

  constructor(
    private dataService: AccountService,
    private snackBar: MatSnackBar,
    private router: Router,
    private classroomService: ClassroomService
  ) {}

  addClassroom() {
    if (this.classroomForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    const formValue = this.classroomForm.value;
    const user = JSON.parse(window.sessionStorage.getItem('user') || '{}');

    const start_time = new Date(`2000-01-01T${formValue.start_time}`).toISOString();
    const end_time = new Date(`2000-01-01T${formValue.end_time}`).toISOString();

    const payload = {
      name: formValue.name,
      teacherId: Number(user.id),
      start_time,
      end_time

    };

    this.dataService.postRequest('classroom', payload).subscribe({
      next: (res: any) => {
        const newClassroom = res.data;
        this.classrooms.push(newClassroom);
        console.log(res);
        this.snackBar.open('Classroom created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.classroomForm.reset();


      },
      error: (err) => {
        this.snackBar.open('Error creating classroom. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goToClassroom(id:number){
    this.router.navigate(['/dashboard/teacher/classroom', id]);
  }
}
