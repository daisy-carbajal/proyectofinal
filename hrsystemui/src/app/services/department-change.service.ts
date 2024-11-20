import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentChangeService {
  private apiUrl = 'http://localhost:3000/department-change';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        'X-User-ID': this.authService.getUserId()?.toString() || '',
        'X-Role-ID': this.authService.getRoleId()?.toString() || '',
      }),
    };
  }

  getAllDepartmentChanges(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postDepartmentChange(departmentChange: any): Observable<any> {
    return this.http.post(this.apiUrl, departmentChange, this.getHeaders());
  }

  getDepartmentChangeById(departmentChangeId: number): Observable<any> {
    const url = `${this.apiUrl}/${departmentChangeId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateDepartmentChange(
    departmentChangeId: number,
    updatedDepartmentChange: any
  ): Observable<any> {
    const url = `${this.apiUrl}/u/${departmentChangeId}`;
    return this.http.put(url, updatedDepartmentChange, this.getHeaders());
  }

  deactivateDepartmentChange(
    departmentChangeId: number,
    deactivatedDepartmentChange: any
  ): Observable<any> {
    const url = `${this.apiUrl}/d/${departmentChangeId}`;
    return this.http.patch(url, deactivatedDepartmentChange, this.getHeaders());
  }

  deleteDepartmentChange(departmentChangeId: number): Observable<any> {
    const url = `${this.apiUrl}/${departmentChangeId}`;
    return this.http.delete(url, this.getHeaders());
  }

  approveDepartmentChange(departmentChange: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve`, departmentChange, this.getHeaders());
  }

  denyDepartmentChange(departmentChange: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/deny`, departmentChange, this.getHeaders());
  }
}
