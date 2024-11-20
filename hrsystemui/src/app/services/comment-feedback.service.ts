import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentFeedbackService {

  private apiUrl = 'http://localhost:3000/comment-feedback';

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

  postCommentFeedback(commentFeedback: any): Observable<any> {
    return this.http.post(this.apiUrl, commentFeedback, this.getHeaders());
  }

  getCommentFeedbackByFeedbackID(feedbackID: number): Observable<any> {
    const url = `${this.apiUrl}/${feedbackID}`;
    return this.http.get(url, this.getHeaders());
  }

  updateCommentFeedback(commentFeedbackID: number, updatedCommentFeedback: any): Observable<any> {
    const url = `${this.apiUrl}/u/${commentFeedbackID}`;
    return this.http.put(url, updatedCommentFeedback, this.getHeaders());
  }

  deactivateCommentFeedback(commentFeedbackID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${commentFeedbackID}`;
    return this.http.patch(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteCommentFeedback(commentFeedbackID: number): Observable<any> {
    const url = `${this.apiUrl}/${commentFeedbackID}`;
    return this.http.delete(url, this.getHeaders());
  }
}
