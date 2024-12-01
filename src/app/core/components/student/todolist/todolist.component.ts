import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../../../../service/classroom.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
// import { Assignment } from '../../../../../config/assignment.interface';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Submission {
    id: number;
    student: {
        id: number;
        name: string;
        email: string;
    };
    submittedAt: Date;
    fileUrl: string;
    grade?: number;
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    submissions?: Submission[];
    status?: 'Submitted' | 'Not Submitted';
    grade?: number | string;
    feedback?: string;

}

interface Submission {
    id: number;
    studentId: number;
    assignmentId: number;
    grade?: number;
    fileUrl: string;
    submittedAt: Date;
    feedback?: string;
    student: {
        id: number;
        name: string;
        email: string;
    };
}

interface AssignmentWithStatus extends Assignment {
    submission?: Submission;
    status: 'Submitted' | 'Not Submitted';
    grade: number | string;
    feedback?: string;
}

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css',
  providers: [ClassroomService]
})
export class TodolistComponent implements OnInit {
  classrooms: any[] = [];

  classroom: any = null;
  enrolledStudents: Student[] = [];
  filteredStudents: Student[] = [];
  selectedAssignment: any = null;
  selectedFile: File | null = null;
  uploadComment: string = '';
  isSubmitting = false;
  assignments: Assignment[] = [];
  submissions: Submission[] = [];
  constructor(
    private classroomService: ClassroomService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    const user = JSON.parse(window.sessionStorage.getItem('user') || '{}');
    if (!user.id) {
      this.snackBar.open('Please login first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/login']);
      return;
    }
    this.loadClassrooms(user.id);
  }

  loadGrades(assignmentId: number) {
    this.classroomService.getSubmissionsByAssignment(assignmentId).subscribe({
        next: (submissions) => {
            console.log('Received submissions:', submissions);
            this.submissions = submissions;

            // Find the current user's submission
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            const userSubmission = submissions.find((sub: any) => sub.student.id === user.id);

            if (userSubmission) {
                // If there's a submission, get the grade
                const grade = userSubmission.grade ?? 'Not graded';
                console.log('User grade:', grade);
                // You can store the grade in a component property if needed
                // this.currentGrade = grade;
            } else {
                console.log('No submission found for this user');
            }
        },
        error: (error) => {
            console.error('Error fetching submissions:', error);
            this.snackBar.open('Error fetching grade information', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        }
    });
  }

  loadClassrooms(userId: number) {
    this.classroomService.getStudentClassrooms(userId).subscribe({
        next: (response: any) => {
            this.classrooms = response;
            if (this.classrooms.length > 0) {
                this.classroom = this.classrooms[0].classroom;
                if (this.classroom.assignments) {
                    this.assignments = this.classroom.assignments;

                    // For each assignment, fetch its submissions
                    this.assignments.forEach(assignment => {
                        this.classroomService.getSubmissionsByAssignment(assignment.id).subscribe({
                            next: (submissions: any[]) => {
                                // Find current user's submission
                                const userSubmission = submissions.find(sub => sub.student.id === userId);

                                // Update assignment with submission status and grade
                                assignment.status = userSubmission ? 'Submitted' : 'Not Submitted';
                                assignment.grade = userSubmission?.grade ?? 'Not graded';
                                assignment.feedback = userSubmission?.feedback ?? 'No feedback';  // Add this line
                            },
                            error: (error) => {
                                console.error('Error fetching submissions:', error);
                                // assignment.status = 'Error';
                                assignment.grade = 'Error loading';
                            }
                        });
                    });
                }
            }
        },
        error: (error) => {
            this.snackBar.open('Error fetching classrooms', 'Close', {
                duration: 3000
            });
        }
    });
  }

  selectAssignment(assignment: Assignment) {
    console.log('Selected assignment:', assignment);
    this.selectedAssignment = assignment;
    this.selectedFile = null;
    this.uploadComment = '';
    this.loadGrades(assignment.id);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.snackBar.open('File size must be less than 10MB', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        input.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Only PDF, DOC, DOCX, or ZIP files are allowed', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        input.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  onUploadSubmit(): void {
    console.log('Starting submission process');

    if (!this.selectedFile || !this.selectedAssignment) {
      console.log('Missing required data:', {
        hasFile: !!this.selectedFile,
        hasAssignment: !!this.selectedAssignment
      });
      this.snackBar.open('Please select a file to upload', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const user = JSON.parse(window.sessionStorage.getItem('user') || '{}');
    if (!user.id) {
      console.log('User not found in session storage');
      this.snackBar.open('User not authenticated', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    console.log('Submission details:', {
      assignmentId: this.selectedAssignment.id,
      studentId: user.id,
      fileName: this.selectedFile.name,
      fileSize: this.selectedFile.size,
      fileType: this.selectedFile.type
    });

    this.isSubmitting = true;

    this.classroomService.submitAssignment(
      this.selectedAssignment.id,
      user.id,
      this.selectedFile
    ).subscribe({
      next: (response: any) => {
        console.log('Submission successful:', response);

        this.snackBar.open('Assignment submitted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.closeModal();
        this.resetForm();
        this.loadClassrooms(user.id);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Submission error:', error);

        let errorMessage = 'Error submitting assignment';

        if (error.status === 409) {
          errorMessage = 'You have already submitted this assignment';
        } else if (error.status === 413) {
          errorMessage = 'File is too large';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });

        this.isSubmitting = false;
      },
      complete: () => {
        console.log('Submission process completed');
        this.isSubmitting = false;
      }
    });
  }

  private closeModal() {
    const modal = document.getElementById('uploadAssignmentModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  private resetForm() {
    this.selectedFile = null;
    this.uploadComment = '';
    this.isSubmitting = false;

    // Reset file input
    const fileInput = document.getElementById('file_input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  goBack() {
    this.router.navigate(['/classroom']);
  }

  onSubmit() {
    console.log('Form submitted');
  }

  filterStudents(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredStudents = this.enrolledStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    );
  }

  onStudentSelect(event: Event, student: Student) {
    const checkbox = event.target as HTMLInputElement;
    console.log(`Student ${student.name} ${checkbox.checked ? 'selected' : 'deselected'}`);
  }

  loadAssignments() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const studentId = user.id;

    if (!this.classroom || !this.classroom.id) {
        console.error('No classroom ID available');
        return;
    }


}
}
