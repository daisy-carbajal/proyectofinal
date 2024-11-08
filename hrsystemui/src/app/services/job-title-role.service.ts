import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobtitleRoleService {

  private apiUrl = 'http://localhost:3000/job-title-role';

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

  getAllJobTitleRoles(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postJobTitleRole(jobtitlerole: any): Observable<any> {
    return this.http.post(this.apiUrl, jobtitlerole, this.getHeaders());
  }

  getJobTitleRoleById(jobTitleRoleId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleRoleId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateJobTitleRole(jobTitleRoleId: number, updatedJobTitleRole: any): Observable<any> {
    const url = `${this.apiUrl}/u/${jobTitleRoleId}`;
    return this.http.put(url, updatedJobTitleRole, this.getHeaders());
  }

  deactivateJobTitleRole(jobTitleRoleId: number, deactivatedJobTitleRole: any): Observable<any> {
    const url = `${this.apiUrl}/d/${jobTitleRoleId}`;
    return this.http.put(url, deactivatedJobTitleRole, this.getHeaders());
  }

  deleteJobTitleRole(jobTitleRoleId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleRoleId}`;
    return this.http.delete(url, this.getHeaders());
  }
}