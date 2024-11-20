import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionCategoryService {
  private apiUrl = 'http://localhost:3000/permission-category';

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

  postPermissionCategory(category: any): Observable<any> {
    return this.http.post(this.apiUrl, category, this.getHeaders());
  }

  getAllPermissionCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  getAllPermissionsByCategories(): Observable<any[]> {
    const url = `${this.apiUrl}/categories`;
    return this.http.get<any[]>(url, this.getHeaders());
  }

  getPermissionsByCategory(categoryId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.get<any[]>(url, this.getHeaders());
  }

  updatePermissionCategory(categoryId: number, updatedCategory: any): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.put(url, updatedCategory, this.getHeaders());
  }

  deactivatePermissionCategory(categoryId: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/deactivate/${categoryId}`;
    return this.http.patch(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deletePermissionCategory(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete(url, this.getHeaders());
  }
}