import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationDetailService {

  private apiUrl = 'http://localhost:3000/eval-detail';

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

  postEvaluationDetail(detail: any): Observable<any> {
    return this.http.post(this.apiUrl, detail, this.getHeaders());
  }

  getEvaluationDetailsByEvaluationMasterID(evaluationMasterID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluationMasterID}`;
    return this.http.get(url, this.getHeaders());
  }

  updateEvaluationDetail(evaluationDetailID: number, updatedDetail: any): Observable<any> {
    const url = `${this.apiUrl}/${evaluationDetailID}`;
    return this.http.put(url, updatedDetail, this.getHeaders());
  }

  deactivateEvaluationDetail(evaluationDetailID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${evaluationDetailID}`;
    return this.http.put(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteEvaluationDetail(evaluationDetailID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluationDetailID}`;
    return this.http.delete(url, this.getHeaders());
  }
}