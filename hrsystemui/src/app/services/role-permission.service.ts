import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private apiUrl = 'http://localhost:3000/role-permissions';

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

  postRolePermission(rolePermission: any): Observable<any> {
    return this.http.post(this.apiUrl, rolePermission, this.getHeaders());
  }

  getAllRolePermissions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getRolePermissionsByRoleID(roleId: number): Observable<any> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.get(url, this.getHeaders());
  }

  deactivateRolePermission(id: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${id}`;
    return this.http.put(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteRolePermission(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getHeaders());
  }
}
