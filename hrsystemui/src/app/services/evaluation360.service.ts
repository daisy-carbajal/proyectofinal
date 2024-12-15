import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class Evaluation360Service {
  private apiUrl = 'http://localhost:3000/eval360';

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

  createEvaluation360(evaluation360: any): Observable<any> {
    return this.http.post(this.apiUrl, evaluation360, this.getHeaders());
  }

  getAllEvaluation360(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getEvaluation360Details(): Observable<any> {
    const url = `${this.apiUrl}/details`;
    return this.http.get(url, this.getHeaders());
  }

  // Actualizar una evaluación 360
  updateEvaluation360(evaluation360ID: number, updatedData: any): Observable<any> {
    const url = `${this.apiUrl}/${evaluation360ID}`;
    return this.http.put(url, updatedData, this.getHeaders());
  }

  // Desactivar (soft delete) una evaluación 360
  deactivateEvaluation360(evaluation360ID: number): Observable<any> {
    const url = `${this.apiUrl}/deactivate/${evaluation360ID}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  // Eliminar (hard delete) una evaluación 360
  deleteEvaluation360(evaluation360ID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluation360ID}`;
    return this.http.delete(url, this.getHeaders());
  }

  updateExpiredEvaluations(): Observable<any> {
    const url = `${this.apiUrl}/update-expired`;
    return this.http.post(url, {}, this.getHeaders());
  }
}