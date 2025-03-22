import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/notifications';

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

  getNotificationsByUserId(userId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<any[]>(url, this.getHeaders());
  }

  markAsRead(notificationId: number): Observable<any> {
    const url = `${this.apiUrl}/read/${notificationId}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  deleteNotification(notificationId: number): Observable<any> {
    const url = `${this.apiUrl}/${notificationId}`;
    return this.http.delete(url, this.getHeaders());
  }
}