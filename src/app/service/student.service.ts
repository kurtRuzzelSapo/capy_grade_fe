import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl:string = 'http://localhost:3000/capy_grade';
  constructor(private http: HttpClient) {}

}
