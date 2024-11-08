import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryActionService {

  private apiUrl = 'http://localhost:3000/da';

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

  getAllDisciplinaryActions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postDisciplinaryAction(disciplinaryAction: any): Observable<any> {
    return this.http.post(this.apiUrl, disciplinaryAction, this.getHeaders());
  }

  getDisciplinaryActionById(disciplinaryActionId: number): Observable<any> {
    const url = `${this.apiUrl}/${disciplinaryActionId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateDisciplinaryAction(disciplinaryActionId: number, updatedDisciplinaryAction: any): Observable<any> {
    const url = `${this.apiUrl}/u/${disciplinaryActionId}`;
    return this.http.put(url, updatedDisciplinaryAction, this.getHeaders());
  }

  deactivateDisciplinaryAction(disciplinaryActionId: number, deactivatedDisciplinaryAction: any): Observable<any> {
    const url = `${this.apiUrl}/d/${disciplinaryActionId}`;
    return this.http.put(url, deactivatedDisciplinaryAction, this.getHeaders());
  }

  deleteDisciplinaryAction(disciplinaryActionId: number): Observable<any> {
    const url = `${this.apiUrl}/${disciplinaryActionId}`;
    return this.http.delete(url, this.getHeaders());
  }
}