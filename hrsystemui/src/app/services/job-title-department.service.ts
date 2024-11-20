import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobtitleDepartmentService {

  private apiUrl = 'http://localhost:3000/job-title-dept';

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

  getAllJobTitleDepartments(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postJobTitleDepartment(jobtitledepartment: any): Observable<any> {
    return this.http.post(this.apiUrl, jobtitledepartment, this.getHeaders());
  }

  getJobTitlesByDepartmentId(jobTitleDepartmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleDepartmentId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateJobTitleDepartment(jobTitleDepartmentId: number, updatedJobTitleDepartment: any): Observable<any> {
    const url = `${this.apiUrl}/u/${jobTitleDepartmentId}`;
    return this.http.put(url, updatedJobTitleDepartment, this.getHeaders());
  }

  deactivateJobTitleDepartment(jobTitleDepartmentId: number, deactivatedJobTitleDepartment: any): Observable<any> {
    const url = `${this.apiUrl}/d/${jobTitleDepartmentId}`;
    return this.http.patch(url, deactivatedJobTitleDepartment, this.getHeaders());
  }

  deleteJobTitleDepartment(jobTitleDepartmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleDepartmentId}`;
    return this.http.delete(url, this.getHeaders());
  }
}