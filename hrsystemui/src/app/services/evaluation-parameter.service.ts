import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationParameterService {

  private apiUrl = 'http://localhost:3000/eval-params';

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

  postEvaluationParameter(evaluationParameter: any): Observable<any> {
    return this.http.post(this.apiUrl, evaluationParameter, this.getHeaders());
  }

  getAllEvaluationParameters(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  updateEvaluationParameter(evaluationParameterID: number, updatedEvaluationParameter: any): Observable<any> {
    const url = `${this.apiUrl}/u/${evaluationParameterID}`;
    return this.http.put(url, updatedEvaluationParameter, this.getHeaders());
  }

  deactivateEvaluationParameter(evaluationParameterID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${evaluationParameterID}`;
    return this.http.put(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteEvaluationParameter(evaluationParameterID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluationParameterID}`;
    return this.http.delete(url, this.getHeaders());
  }
}