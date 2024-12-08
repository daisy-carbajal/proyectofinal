import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private apiUrl = 'http://localhost:3000/summary';

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

  // Servicio para obtener el conteo de incidentes activos
  getActiveIncidentsCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active-incidents-count`, this.getHeaders());
  }

  // Servicio para obtener el conteo de evaluaciones no revisadas
  getUnreviewedEvaluationsCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unreviewed-evaluations-count`, this.getHeaders());
  }

  // Servicio para obtener el conteo de acciones disciplinarias no reconocidas
  getUnacknowledgedActionsCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unacknowledged-actions-count`, this.getHeaders());
  }

  // Servicio para obtener el conteo de comentarios creados hoy
  getTodayCommentsCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/today-comments-count`, this.getHeaders());
  }
}
