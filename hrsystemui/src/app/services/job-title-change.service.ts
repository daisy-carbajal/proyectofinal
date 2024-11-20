import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobtitleChangeService {

  private apiUrl = 'http://localhost:3000/job-title-change';

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

  getAllJobTitleChanges(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postJobTitleChange(jobtitlechange: any): Observable<any> {
    return this.http.post(this.apiUrl, jobtitlechange, this.getHeaders());
  }

  getJobTitleChangeById(jobTitleChangeId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleChangeId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateJobTitleChange(jobTitleChangeId: number, updatedJobTitleChange: any): Observable<any> {
    const url = `${this.apiUrl}/u/${jobTitleChangeId}`;
    return this.http.put(url, updatedJobTitleChange, this.getHeaders());
  }

  deactivateJobTitleChange(jobTitleChangeId: number, deactivatedJobTitleChange: any): Observable<any> {
    const url = `${this.apiUrl}/d/${jobTitleChangeId}`;
    return this.http.patch(url, deactivatedJobTitleChange, this.getHeaders());
  }

  deleteJobTitleChange(jobTitleChangeId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleChangeId}`;
    return this.http.delete(url, this.getHeaders());
  }

  approveChanges(useChangeId: number, infoChange: any): Observable<any> {
    const url = `${this.apiUrl}/approve/${useChangeId}`
    return this.http.put(url, infoChange, this.getHeaders());
  }

  denyChanges(useChangeId: number, infoChange: any): Observable<any> {
    const url = `${this.apiUrl}/deny/${useChangeId}`
    return this.http.put(url, infoChange, this.getHeaders());
  }

  getPendingChanges(): Observable<any> {
    const url = `${this.apiUrl}/changes/pending`;
    return this.http.get(url, this.getHeaders());
  }

  getCurrentDetailsByID(userId: number): Observable<any> {
    const url = `${this.apiUrl}/change-detail/current-details/${userId}`;
    return this.http.get(url, this.getHeaders());
  }

  getPendingChangesByID(userId: number): Observable<any> {
    const url = `${this.apiUrl}/change-detail/pending-changes/${userId}`;
    return this.http.get(url, this.getHeaders());
  }
}