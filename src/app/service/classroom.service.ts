import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Assignment } from '../../config/assignment.interface';
@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  public apiUrl:string = 'http://localhost:3000/capy_grade';
  constructor(private http: HttpClient) {}

  // postRequest(url: string, data: any) {
  //   return this.http.post(`${this.apiUrl}/${url}`, data);
  // }

  // getRequest(url: string) {
  //     return this.http.get(`${this.apiUrl}/${url}`);
  // }

  // deleteRequest(url: string) {
  //     return this.http.delete(`${this.apiUrl}/${url}`);
  // }

  // putRequest(url: string, data: any) {
  //     return this.http.put(`${this.apiUrl}/${url}`, data);
  // }

  getClassrooms(teacherId: number) {
    return this.http.get(`${this.apiUrl}/classroom/${teacherId}`);
  }
  getClassroombyId(classroomId: number) {
    return this.http.get(`${this.apiUrl}/classroomID/${classroomId}`);
  }

  getAllStudents() {
    return this.http.get(`${this.apiUrl}/students`);
  }

  addStudentToClassroom(classroomId: string, studentId: number) {
    return this.http.post(`${this.apiUrl}/addstudents/${classroomId}/students`, {
        classroomId: parseInt(classroomId),
        studentId: [studentId]
    });
}

getStudentsByClassroomId(classroomId: string) {
  return this.http.get(`${this.apiUrl}/enrolledstudents/${classroomId}`);
}


createAssignment(assignmentData: {
  title: string;
  description: string;
  classroomId: number;
  dueDate: Date;
}) {
  return this.http.post(`${this.apiUrl}/assignments`, assignmentData);
}


getAssignmentsForClassroom(classroomId: number): Observable<Assignment[]> {
  return this.http.get<Assignment[]>(`${this.apiUrl}/classrooms/${classroomId}/assignments`);
}

getStudentClassrooms(studentId: number) {
  return this.http.get(`${this.apiUrl}/classrooms/${studentId}`);
}


submitAssignment(assignmentId: number, studentId: number, file: File): Observable<any> {
  console.log('Starting assignment submission:', {
    assignmentId,
    studentId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('studentId', studentId.toString());
  formData.append('assignmentId', assignmentId.toString());
  formData.append('fileUrl', file.name); // Adding fileUrl as requested by backend

  // Log the data being sent
  console.log('Sending data:', {
    file: file.name,
    studentId: studentId,
    assignmentId: assignmentId,
    fileUrl: file.name
  });

  return this.http.post(
    `${this.apiUrl}/assignments/${assignmentId}/submit`,
    {
      studentId: studentId,
      fileUrl: file.name, // Using filename as fileUrl temporarily
      assignmentId: assignmentId
    }
  );
}


getSubmissionsByAssignment(assignmentId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/assignments/${assignmentId}/submissions`);
}

gradeSubmission(submissionId: number, grade: number, feedback: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/submissions/${submissionId}/grade`, { grade, feedback });
}

downloadFile(fileUrl: string): Observable<Blob> {
  return this.http.get(fileUrl, {
      responseType: 'blob',
      headers: {
          // Add any necessary headers
          'Accept': 'application/octet-stream'
      }
  });
}

  // logout() {
  //   window.sessionStorage.removeItem('user');
  // }
}
