import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private apiUrl = 'http://localhost:3000/user-roles';

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

  getUserRoles(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postUserRole(userRole: any): Observable<any> {
    return this.http.post(this.apiUrl, userRole, this.getHeaders());
  }

  getUserRoleById(userRoleId: number): Observable<any> {
    const url = `${this.apiUrl}/${userRoleId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateUserRole(userRoleId: number, updatedUserRole: any): Observable<any> {
    const url = `${this.apiUrl}/u/${userRoleId}`;
    return this.http.put(url, updatedUserRole, this.getHeaders());
  }

  deactivateUserRole(userRoleId: number, deactivatedUserRole: any): Observable<any> {
    const url = `${this.apiUrl}/d/${userRoleId}`;
    return this.http.put(url, deactivatedUserRole, this.getHeaders());
  }

  deleteUserRole(userRoleId: number): Observable<any> {
    const url = `${this.apiUrl}/${userRoleId}`;
    return this.http.delete(url, this.getHeaders());
  }
}