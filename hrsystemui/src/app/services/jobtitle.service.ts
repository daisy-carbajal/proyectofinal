import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobtitleService {

  private apiUrl = 'http://localhost:3000/jobtitle';

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

  getAllJobTitles(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getAllJobTitleDetails(): Observable<any> {
    const url = `${this.apiUrl}/details`;
    return this.http.get(url, this.getHeaders());
  }

  postJobTitle(jobtitle: any): Observable<any> {
    return this.http.post(this.apiUrl, jobtitle, this.getHeaders());
  }

  getJobTitleById(jobTitleId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateJobTitle(jobTitleId: number, updatedJobTitle:{Title: string, Description: string }): Observable<any> {
    const url = `${this.apiUrl}/u/${jobTitleId}`;
    return this.http.put(url, updatedJobTitle, this.getHeaders());
  }

  deactivateJobTitle(jobTitleId: number): Observable<any> {
    const url = `${this.apiUrl}/d/${jobTitleId}`;
    return this.http.patch(url, this.getHeaders());
  }

  deleteJobTitle(jobTitleId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleId}`;
    return this.http.delete(url, this.getHeaders());
  }
}
