import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryActionReasonService {

  private apiUrl = 'http://localhost:3000/da-reason';

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

  getAllDisciplinaryActionReasons(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postDisciplinaryActionReason(disciplinaryActionReason: any): Observable<any> {
    return this.http.post(this.apiUrl, disciplinaryActionReason, this.getHeaders());
  }

  getDisciplinaryActionReasonById(disciplinaryActionReasonId: number): Observable<any> {
    const url = `${this.apiUrl}/${disciplinaryActionReasonId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateDisciplinaryActionReason(disciplinaryActionReasonId: number, updatedDisciplinaryActionReason: any): Observable<any> {
    const url = `${this.apiUrl}/u/${disciplinaryActionReasonId}`;
    return this.http.put(url, updatedDisciplinaryActionReason, this.getHeaders());
  }

  deactivateDisciplinaryActionReason(disciplinaryActionReasonId: number, deactivatedDisciplinaryActionReason: any): Observable<any> {
    const url = `${this.apiUrl}/d/${disciplinaryActionReasonId}`;
    return this.http.patch(url, deactivatedDisciplinaryActionReason, this.getHeaders());
  }

  deleteDisciplinaryActionReason(disciplinaryActionReasonId: number): Observable<any> {
    const url = `${this.apiUrl}/${disciplinaryActionReasonId}`;
    return this.http.delete(url, this.getHeaders());
  }
}