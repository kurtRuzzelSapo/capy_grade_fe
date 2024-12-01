import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '../../config/assignment.interface';
@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  private apiUrl:string = 'http://localhost:3000/capy_grade';
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

  // logout() {
  //   window.sessionStorage.removeItem('user');
  // }
}
