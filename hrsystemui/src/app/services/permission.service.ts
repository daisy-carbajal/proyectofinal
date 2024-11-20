import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl = 'http://localhost:3000/permissions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'X-User-ID': this.authService.getUserId()?.toString() || '',
      'X-Role-ID': this.authService.getRoleId()?.toString() || '',
    });
    console.log('Headers sent:', headers);
    return { headers };
  }

  postPermission(permission: any): Observable<any> {
    return this.http.post(this.apiUrl, permission, this.getHeaders());
  }

  getAllPermissions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  updatePermission(id: number, updatedPermission: any): Observable<any> {
    const url = `${this.apiUrl}/u/${id}`;
    return this.http.put(url, updatedPermission, this.getHeaders());
  }

  deactivatePermission(PermissionID: number): Observable<any> {
    const url = `${this.apiUrl}/changes/d/${PermissionID}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  deletePermission(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getHeaders());
  }
}