import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = 'http://localhost:3000/feedback';

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

  getAllFeedbacks(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postFeedback(feedback: any): Observable<any> {
    return this.http.post(this.apiUrl, feedback, this.getHeaders());
  }

  getFeedbackById(feedbackId: number): Observable<any> {
    const url = `${this.apiUrl}/${feedbackId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateFeedback(feedbackId: number, updatedFeedback: any): Observable<any> {
    const url = `${this.apiUrl}/u/${feedbackId}`;
    return this.http.put(url, updatedFeedback, this.getHeaders());
  }

  deactivateFeedback(feedbackId: number, deactivatedFeedback: any): Observable<any> {
    const url = `${this.apiUrl}/d/${feedbackId}`;
    return this.http.patch(url, deactivatedFeedback, this.getHeaders());
  }

  deleteFeedback(feedbackId: number): Observable<any> {
    const url = `${this.apiUrl}/${feedbackId}`;
    return this.http.delete(url, this.getHeaders());
  }
}