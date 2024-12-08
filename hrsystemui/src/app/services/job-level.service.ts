import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobLevelService {

  private apiUrl = 'http://localhost:3000/job-level';

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

  // Obtener todos los niveles de trabajo
  getAllJobLevels(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  // Crear un nuevo nivel de trabajo
  postJobLevel(jobLevel: any): Observable<any> {
    return this.http.post(this.apiUrl, jobLevel, this.getHeaders());
  }

  // Actualizar un nivel de trabajo existente
  updateJobLevel(jobLevelId: number, updatedJobLevel: any): Observable<any> {
    const url = `${this.apiUrl}/${jobLevelId}`;
    return this.http.put(url, updatedJobLevel, this.getHeaders());
  }

  // Desactivar un nivel de trabajo
  deactivateJobLevel(jobLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobLevelId}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  // Eliminar un nivel de trabajo
  deleteJobLevel(jobLevelId: number): Observable<any> {
    const url = `${this.apiUrl}/${jobLevelId}`;
    return this.http.delete(url, this.getHeaders());
  }
}