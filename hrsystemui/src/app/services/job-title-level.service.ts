import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobTitleLevelService {

  private apiUrl = 'http://localhost:3000/jobtitlelevel'; // URL base del endpoint

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

  // Obtener todos los niveles de títulos de trabajo
  getAllJobTitleLevels(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  // Crear un nuevo nivel de título de trabajo
  createJobTitleLevel(jobTitleLevel: any): Observable<any> {
    return this.http.post(this.apiUrl, jobTitleLevel, this.getHeaders());
  }

  // Actualizar un nivel de título de trabajo existente
  updateJobTitleLevel(jobTitleLevelId: number, updatedJobTitleLevel: any): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleLevelId}`;
    return this.http.put(url, updatedJobTitleLevel, this.getHeaders());
  }

  // Desactivar un nivel de título de trabajo
  deactivateJobTitleLevel(jobTitleLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleLevelId}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  // Eliminar un nivel de título de trabajo
  deleteJobTitleLevel(jobTitleLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobTitleLevelId}`;
    return this.http.delete(url, this.getHeaders());
  }
}