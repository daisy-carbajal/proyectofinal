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

  updateStartDateUserRole(
    userRoleId: number,
    updatedStartDateUserRole: any
  ): Observable<any> {
    const url = `${this.apiUrl}/${userRoleId}`;
    return this.http.put(url, updatedStartDateUserRole, this.getHeaders());
  }

  updateUserRole(roleUpdateData: {
    UserID: number;
    RoleID: number;
  }): Observable<any> {
    const url = `${this.apiUrl}/ur/${roleUpdateData.UserID}`;
    return this.http.put(url, roleUpdateData, this.getHeaders());
  }
}
