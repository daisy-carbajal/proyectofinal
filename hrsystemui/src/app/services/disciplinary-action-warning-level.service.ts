import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getWarningLevelFiltered(newUserID: number, newReasonID: number): Observable<any> {
    const params = new HttpParams()
      .set('NewUserID', newUserID.toString())
      .set('NewReasonID', newReasonID.toString());
    const url = `${this.apiUrl}/filtered/`;
    return this.http.get(url, { ...this.getHeaders(), params });
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

  deactivateWarningLevel(warningLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/d/${warningLevelId}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  deleteWarningLevel(warningLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${warningLevelId}`;
    return this.http.delete(url, this.getHeaders());
  }
}