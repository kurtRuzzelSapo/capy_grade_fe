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
      next: (response) => {
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
}
