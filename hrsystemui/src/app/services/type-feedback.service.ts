import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TypeFeedbackService {

  private apiUrl = 'http://localhost:3000/type-feedback';

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

  getAllTypeFeedbacks(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postTypeFeedback(typeFeedback: any): Observable<any> {
    return this.http.post(this.apiUrl, typeFeedback, this.getHeaders());
  }

  getTypeFeedbackById(typeFeedbackId: number): Observable<any> {
    const url = `${this.apiUrl}/${typeFeedbackId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateTypeFeedback(typeFeedbackId: number, updatedTypeFeedback: any): Observable<any> {
    const url = `${this.apiUrl}/u/${typeFeedbackId}`;
    return this.http.put(url, updatedTypeFeedback, this.getHeaders());
  }

  deactivateTypeFeedback(typeFeedbackId: number, deactivatedTypeFeedback: any): Observable<any> {
    const url = `${this.apiUrl}/d/${typeFeedbackId}`;
    return this.http.patch(url, deactivatedTypeFeedback, this.getHeaders());
  }

  deleteTypeFeedback(typeFeedbackId: number): Observable<any> {
    const url = `${this.apiUrl}/${typeFeedbackId}`;
    return this.http.delete(url, this.getHeaders());
  }
}