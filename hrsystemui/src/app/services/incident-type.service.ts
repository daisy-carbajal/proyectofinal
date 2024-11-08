import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentTypeService {

  private apiUrl = 'http://localhost:3000/incident-type';

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

  getAllIncidentTypes(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postIncidentType(incidentType: any): Observable<any> {
    return this.http.post(this.apiUrl, incidentType, this.getHeaders());
  }

  getIncidentTypeById(incidentTypeId: number): Observable<any> {
    const url = `${this.apiUrl}/${incidentTypeId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateIncidentType(incidentTypeId: number, updatedIncidentType: any): Observable<any> {
    const url = `${this.apiUrl}/u/${incidentTypeId}`;
    return this.http.put(url, updatedIncidentType, this.getHeaders());
  }

  deactivateIncidentType(incidentTypeId: number, deactivatedIncidentType: any): Observable<any> {
    const url = `${this.apiUrl}/d/${incidentTypeId}`;
    return this.http.put(url, deactivatedIncidentType, this.getHeaders());
  }

  deleteIncidentType(incidentTypeId: number): Observable<any> {
    const url = `${this.apiUrl}/${incidentTypeId}`;
    return this.http.delete(url, this.getHeaders());
  }
}