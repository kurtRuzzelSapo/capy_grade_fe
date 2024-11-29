import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl:string = 'http://localhost:3000/capy_grade';
  constructor(private http: HttpClient) {}

  postRequest(url: string, data: any) {
    return this.http.post(`${this.apiUrl}/${url}`, data);
  }

  getRequest(url: string) {
      return this.http.get(`${this.apiUrl}/${url}`);
  }

  deleteRequest(url: string) {
      return this.http.delete(`${this.apiUrl}/${url}`);
  }

  putRequest(url: string, data: any) {
      return this.http.put(`${this.apiUrl}/${url}`, data);
  }
}
