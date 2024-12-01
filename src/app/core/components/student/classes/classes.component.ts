import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassroomService } from '../../../../service/classroom.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface ClassroomData {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  teacherId: number;
  teacher: Teacher;
}

interface Classroom {
  classroom: ClassroomData;
  classroomId: number;
  id: number;
  studentId: number;
}

interface ClassroomForm {
  name: FormControl<string | null>;
  start_time: FormControl<string | null>;
  end_time: FormControl<string | null>;
}

@Component({
  selector: 'app-student-classes',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './classes.component.html',
  styles: [`
    @keyframes fadeSlideUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host .animate-fade-slide {
      animation: fadeSlideUp 0.5s ease-out forwards;
      opacity: 0;
      animation-fill-mode: both;
    }

    :host .animate-fade-slide:hover {
      transition: all 0.3s ease;
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
  `]
})
export class StudentClassesComponent implements OnInit {
  classrooms: Classroom[] = [];
  classroomForm: FormGroup<ClassroomForm> = new FormGroup<ClassroomForm>({
    name: new FormControl('', Validators.required),
    start_time: new FormControl('', Validators.required),
    end_time: new FormControl('', Validators.required)
  });

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private classroomService: ClassroomService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(window.sessionStorage.getItem('user') || '{}');

    this.classroomService.getStudentClassrooms(user.id).subscribe({
      next: (response: any) => {
        this.classrooms = response;
        console.log('Student Classrooms:', this.classrooms);
      },
      error: (error) => {
        this.snackBar.open('Error fetching classrooms', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goToClassroom(id: number) {
    this.router.navigate(['/dashboard/student/classroom', id]);
  }

  addClassroom() {
    if (this.classroomForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    console.log('Form values:', this.classroomForm.value);
  }
}
