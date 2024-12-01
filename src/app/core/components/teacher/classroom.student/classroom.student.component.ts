import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../../../service/classroom.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Modal } from 'flowbite';
import { Assignment } from '../../../../../config/assignment.interface';  // Import the interface from your config

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
  feedback?: string;
}

@Component({
  selector: 'app-classroom.student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './classroom.student.component.html',
  styleUrl: './classroom.student.component.css'
})
export class ClassroomStudentComponent implements OnInit {
  classroom:any ={};
  studentForm: FormGroup;
  students: any[] = []; // Replace 'any' with your Student interface
  enrolledStudents: any[] = [];
  filteredStudents: any[] = [];
  selectedStudents: Set<number> = new Set();
  assignmentForm: FormGroup;
  assignments: Assignment[] = [];
  submissions: Submission[] = [];
  selectedAssignment: any = null;
  selectedSubmission: Submission | null = null;
  gradeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({});

    // Initialize assignment form
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
    });

    this.gradeForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      feedback: ['', [Validators.required, ]]
    });
  }

  ngAfterViewInit() {
    // This will help us debug the timing
    setTimeout(() => {
      console.log('Current enrolledStudents after timeout:', this.enrolledStudents);
    }, 2000);
  }

  ngOnInit(): void {
    const classroomId = this.route.snapshot.params['id'];
    console.log('Classroom ID:', classroomId);

    // Get enrolled students
    this.classroomService.getStudentsByClassroomId(classroomId).subscribe({
      next: (response: any) => {
        console.log('Enrolled students: wew', response);
        // Make sure we're accessing the data array correctly
        this.enrolledStudents = Array.isArray(response) ? response : [];
        console.log('Processed enrolled students:', this.enrolledStudents);
      },
      error: (error) => {
        console.error('Error fetching enrolled students:', error);
        this.enrolledStudents = []; // Set to empty array on error
      }
    });

    // Get classroom by id
    this.classroomService.getClassroombyId(classroomId).subscribe({
      next: (response: any) => {
        console.log('Classroom:', response);
        this.classroom = response.data;
      },
      error: (error) => console.error('Error fetching classroom:', error)
    });

    // Get all students
    this.classroomService.getAllStudents().subscribe({
      next: (response: any) => {
        console.log('All students:', response);
        this.students = response.data;
        this.filteredStudents = this.students;
      },
      error: (error) => console.error('Error fetching students:', error)
    });

    // Get assignments for the classroom
    this.classroomService.getAssignmentsForClassroom(classroomId).subscribe({
      next: (response: Assignment[]) => {
        console.log('Assignments:', response);
        this.assignments = response;
      },
      error: (error) => {
        console.error('Error fetching assignments:', error);
        this.assignments = [];
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/teacher/classroom']);
  }

  filterStudents(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    );
  }

  onStudentSelect(event: any, student: any) {
    console.log('Student selection changed:', student.id, event.target.checked);
    if (event.target.checked) {
        this.selectedStudents.add(student.id);
    } else {
        this.selectedStudents.delete(student.id);
    }
    console.log('Current selections:', Array.from(this.selectedStudents));
}

  onSubmit() {
    const classroomId = this.route.snapshot.params['id'];
    const selectedStudentIds = Array.from(this.selectedStudents);

    if (selectedStudentIds.length === 0) {
        console.log('No students selected');
        return;
    }

    console.log('Attempting to add students:', selectedStudentIds, 'to classroom:', classroomId);

    // Create an array of observables for single student additions
    const addStudentRequests = selectedStudentIds.map(studentIds => {
        console.log(`Creating request for student ${studentIds}`);
        return this.classroomService.addStudentToClassroom(classroomId, studentIds);
    });

    // Execute all requests and wait for all to complete
    forkJoin(addStudentRequests).subscribe({
        next: (responses) => {
            console.log('All students added successfully:', responses);
            // Optionally refresh the data
            this.ngOnInit();
            // Close modal if using one
            // Show success message
        },
        error: (error) => {
            console.error('Error adding students:', error);
            // Show error message to user
        },
        complete: () => {
            console.log('Addition process completed');
        }
    });
}

  onSubmitAssignment() {
    if (this.assignmentForm.valid) {
      const classroomId = this.route.snapshot.params['id'];
      const formData = {
        ...this.assignmentForm.value,
        classroomId: Number(classroomId)
      };

      this.classroomService.createAssignment(formData).subscribe({
        next: (response) => {
          console.log('Assignment created:', response);
          // Reset form
          this.assignmentForm.reset();
          // Close modal (using Flowbite)
          const modal = document.getElementById('createAssignmentModal');
          if (modal) {
            // Assuming you're using Flowbite's Modal
            const modalInstance = new Modal(modal);
            modalInstance.hide();
          }
          // You might want to refresh assignments list or show success message
        },
        error: (error) => {
          console.error('Error creating assignment:', error);
          // Handle error (show error message)
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.assignmentForm.controls).forEach(key => {
        const control = this.assignmentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  viewSubmissions(assignment: any) {
    console.log('Viewing submissions for assignment:', assignment); // Debug log

    if (!assignment || !assignment.id) {
        console.error('Invalid assignment object:', assignment);
        return;
    }

    this.selectedAssignment = assignment;
    this.classroomService.getSubmissionsByAssignment(Number(assignment.id)).subscribe({
        next: (submissions) => {
            console.log('Received submissions:', submissions); // Debug log
            this.submissions = submissions;
            const modal = document.getElementById('submissionsModal');
            if (modal) {
                const modalInstance = new Modal(modal);
                modalInstance.show();
            }
        },
        error: (error) => {
            console.error('Error fetching submissions:', error);
            // You might want to show an error message to the user here
        }
    });
  }

  openGradeModal(submission: Submission) {
    this.selectedSubmission = submission;
    this.gradeForm.patchValue({
      grade: submission.grade || ''
    });
    const modal = document.getElementById('gradeModal');
    if (modal) {
      const modalInstance = new Modal(modal);
      modalInstance.show();
    }
  }

  closeGradeModal() {
    const modal = document.getElementById('gradeModal');
    if (modal) {
      const modalInstance = new Modal(modal);
      modalInstance.hide();
    }
  }

  closeSubmissionsModal() {
    const modal = document.getElementById('submissionsModal');
    if (modal) {
      const modalInstance = new Modal(modal);
      modalInstance.hide();
    }
  }

  submitGrade() {
    if (this.gradeForm.valid && this.selectedSubmission) {
      this.classroomService.gradeSubmission(
        this.selectedSubmission.id,
        this.gradeForm.value.grade,
        this.gradeForm.value.feedback
      ).subscribe({
        next: (response) => {
          // Update the submission in the list
          const index = this.submissions.findIndex(s => s.id === this.selectedSubmission?.id);
          if (index !== -1) {
            this.submissions[index] = response;
          }
          this.closeGradeModal();
        },
        error: (error) => {
          console.error('Error grading submission:', error);
        }
      });
    }
  }

  editStudent(student: any) {
    // Implement edit functionality
    console.log('Edit student:', student);
  }

  deleteStudent(student: any) {
    if (confirm('Are you sure you want to remove this student from the classroom?')) {
      // Implement delete functionality
      console.log('Delete student:', student);
    }
  }

  downloadFile(fileUrl: string, event: Event) {
    event.preventDefault(); // Prevent default link behavior

    if (!fileUrl) {
        console.error('No file URL provided');
        return;
    }

    // If the URL is a full URL (starts with http or https)
    if (fileUrl.startsWith('http')) {
        window.open(fileUrl, '_blank');
    } else {
        // If it's a relative URL, prepend your API base URL
        const fullUrl = `${this.classroomService.apiUrl}/${fileUrl}`;
        window.open(fullUrl, '_blank');
    }
  }

  downloadFileDirectly(fileUrl: string) {
    this.classroomService.downloadFile(fileUrl).subscribe({
        next: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            // Extract filename from URL or use a default name
            const filename = fileUrl.split('/').pop() || 'downloaded-file';
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
        },
        error: (error) => {
            console.error('Error downloading file:', error);
            // Show error message to user
        }
    });
  }

}
