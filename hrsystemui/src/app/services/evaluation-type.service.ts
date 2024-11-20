import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTypeService {

  private apiUrl = 'http://localhost:3000/eval-type';

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

  postEvaluationType(evaluationType: any): Observable<any> {
    return this.http.post(this.apiUrl, evaluationType, this.getHeaders());
  }

  getAllEvaluationTypes(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  updateEvaluationType(evaluationTypeID: number, updatedEvaluationType: any): Observable<any> {
    const url = `${this.apiUrl}/u/${evaluationTypeID}`;
    return this.http.put(url, updatedEvaluationType, this.getHeaders());
  }

  deactivateEvaluationType(evaluationTypeID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${evaluationTypeID}`;
    return this.http.patch(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteEvaluationType(evaluationTypeID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluationTypeID}`;
    return this.http.delete(url, this.getHeaders());
  }
}