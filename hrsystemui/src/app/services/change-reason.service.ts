import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChangeReasonService {
  private apiUrl = 'http://localhost:3000/change-reason';

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

  postChangeReason(reason: any): Observable<any> {
    return this.http.post(this.apiUrl, reason, this.getHeaders());
  }

  getAllChangeReasons(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  updateChangeReason(reasonId: number, updatedReason: any): Observable<any> {
    const url = `${this.apiUrl}/${reasonId}`;
    return this.http.put(url, updatedReason, this.getHeaders());
  }

  deactivateChangeReason(reasonId: number, deletedBy: number): Observable<any> {
    const url = `${this.apiUrl}/deactivate/${reasonId}`;
    return this.http.patch(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteChangeReason(reasonId: number): Observable<any> {
    const url = `${this.apiUrl}/${reasonId}`;
    return this.http.delete(url, this.getHeaders());
  }
}