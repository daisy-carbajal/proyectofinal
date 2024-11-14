import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationParameterWeightService {

  private apiUrl = 'http://localhost:3000/eval-params-weight';

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

  createEvaluationParameterWeight(parameterWeight: any): Observable<any> {
    return this.http.post(this.apiUrl, parameterWeight, this.getHeaders());
  }

  getAllEvaluationParameterWeight(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  updateEvaluationParameterWeight(evaluationParamWeightID: number, updatedParameterWeight: any): Observable<any> {
    const url = `${this.apiUrl}/u/${evaluationParamWeightID}`;
    return this.http.put(url, updatedParameterWeight, this.getHeaders());
  }

  deleteEvaluationParameterWeight(evaluationParamWeightID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluationParamWeightID}`;
    return this.http.delete(url, this.getHeaders());
  }
}