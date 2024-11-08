import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryActionWarningLevelService {

  private apiUrl = 'http://localhost:3000/warning-level';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        'X-User-ID': this.authService.getUserId()?.toString() || '',
        'X-Role-ID': this.authService.getRoleId()?.toString() || '',
      }),
    };
  }

  getAllWarningLevels(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postWarningLevel(warningLevel: any): Observable<any> {
    return this.http.post(this.apiUrl, warningLevel, this.getHeaders());
  }

  getWarningLevelById(warningLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${warningLevelId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateWarningLevel(warningLevelId: number, updatedWarningLevel: any): Observable<any> {
    const url = `${this.apiUrl}/u/${warningLevelId}`;
    return this.http.put(url, updatedWarningLevel, this.getHeaders());
  }

  deactivateWarningLevel(warningLevelId: number, deactivatedWarningLevel: any): Observable<any> {
    const url = `${this.apiUrl}/d/${warningLevelId}`;
    return this.http.put(url, deactivatedWarningLevel, this.getHeaders());
  }

  deleteWarningLevel(warningLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${warningLevelId}`;
    return this.http.delete(url, this.getHeaders());
  }
}