import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl = 'http://localhost:3000/incident';

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

  getAllIncidents(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postIncident(incident: any): Observable<any> {
    return this.http.post(this.apiUrl, incident, this.getHeaders());
  }

  getIncidentById(incidentId: number): Observable<any> {
    const url = `${this.apiUrl}/${incidentId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateIncident(incidentId: number, updatedIncident: any): Observable<any> {
    const url = `${this.apiUrl}/u/${incidentId}`;
    return this.http.put(url, updatedIncident, this.getHeaders());
  }

  deactivateIncident(incidentId: number, deactivatedIncident: any): Observable<any> {
    const url = `${this.apiUrl}/d/${incidentId}`;
    return this.http.patch(url, deactivatedIncident, this.getHeaders());
  }

  deleteIncident(incidentId: number): Observable<any> {
    const url = `${this.apiUrl}/${incidentId}`;
    return this.http.delete(url, this.getHeaders());
  }
}