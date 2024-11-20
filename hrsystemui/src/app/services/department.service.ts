import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'http://localhost:3000/department';

  constructor(private http: HttpClient, private authService: AuthService) { }


  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        'X-User-ID': this.authService.getUserId()?.toString() || '',
        'X-Role-ID': this.authService.getRoleId()?.toString() || '',
      }),
    };
  }

  getAllDepartments(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postDepartment(department: any): Observable<any> {
    return this.http.post(this.apiUrl, department, this.getHeaders());
  }

  getDepartmentById(departmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${departmentId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateDepartment(departmentId: number, updatedDepartment: any): Observable<any> {
    const url = `${this.apiUrl}/u/${departmentId}`;
    return this.http.put(url, updatedDepartment, this.getHeaders());
  }

  deactivateDepartment(departmentId: number, deactivatedDepartment: {DeletedBy: any}): Observable<any> {
    const url = `${this.apiUrl}/d/${departmentId}`;
    return this.http.patch(url, deactivatedDepartment, this.getHeaders());
  }

  deleteDepartment(departmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${departmentId}`;
    return this.http.delete(url, this.getHeaders());
  }
}