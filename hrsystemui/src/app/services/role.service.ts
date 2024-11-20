import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:3000/role';

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

  getAllRoles(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postRole(role: any): Observable<any> {
    return this.http.post(this.apiUrl, role, this.getHeaders());
  }

  getRoleById(roleId: number): Observable<any> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateRole(roleId: number, updatedRole: any): Observable<any> {
    const url = `${this.apiUrl}/u/${roleId}`;
    return this.http.put(url, updatedRole, this.getHeaders());
  }

  deactivateRole(
    roleId: number,
    deactivatedRole: {DeletedBy: any}
  ): Observable<any> {
    const url = `${this.apiUrl}/d/${roleId}`;
    return this.http.patch(url, deactivatedRole, this.getHeaders());
  }

  deleteRole(roleId: number): Observable<any> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.delete(url, this.getHeaders());
  }
}
