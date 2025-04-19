import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        'X-User-ID': this.authService.getUserId()?.toString() || '',
        'X-Role-ID': this.authService.getRoleId()?.toString() || ''
      })
    };
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getUsersFiltered(): Observable<any> {
    const url = `${this.apiUrl}/filtered`;
    return this.http.get(url, this.getHeaders());
  }

  getManagerUsers(): Observable<any> {
    const url = `${this.apiUrl}/manager`;
    return this.http.get(url, this.getHeaders());
  }

  getUserDetails(): Observable<any> {
    const url = `${this.apiUrl}/details`;
    return this.http.get(url, this.getHeaders());

  }

  postUser(user: any): Observable<any> {  
    return this.http.post(this.apiUrl, user, this.getHeaders());
  }

  importUsersFromCSV(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const url = `${this.apiUrl}/import-csv`;
    return this.http.post(url, formData, this.getHeaders());
  }

  getUserById(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url, this.getHeaders());

  }

  getUserDetailsById(userId: number): Observable<any> {
    const url = `${this.apiUrl}/user-details/${userId}`;
    return this.http.get<any>(url, this.getHeaders());

  }

  updateUser(userId: number, updatedUser: any): Observable<any> {
    const url = `${this.apiUrl}/u/${userId}`;
    return this.http.put(url, updatedUser, this.getHeaders());
  }

  updateUserField(
    userId: number,
    fieldName: string,
    newValue: any
  ): Observable<any> {
    const url = `${this.apiUrl}/user-detail/${userId}`;
    const body = { fieldName, newValue };
    return this.http.put(url, body, this.getHeaders());
  }

  resendToken(id: number, CreatedBy: any): Observable<any> {
    const url = `${this.apiUrl}/resend-token/${id}`;
    return this.http.put(url, {CreatedBy}, this.getHeaders());
  }

  deactivateUser(
    userId: number,
    deletedBy: { DeletedBy: any }
  ): Observable<any> {
    const url = `${this.apiUrl}/d/${userId}`;
    return this.http.patch(url, deletedBy, this.getHeaders());
  }

  enableUser(
    userId: number,
  ): Observable<any> {
    const url = `${this.apiUrl}/e/${userId}`;
    return this.http.patch(url, {}, this.getHeaders());
  }  

  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url, this.getHeaders());
  }
}