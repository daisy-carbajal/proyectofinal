import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationMasterService {

  private apiUrl = 'http://localhost:3000/eval-master';

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

  postEvaluationMaster(evaluationMaster: any): Observable<any> {
    return this.http.post(this.apiUrl, evaluationMaster, this.getHeaders());
  }

  getAllEvaluationMaster(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getEvaluationMasterByEvaluationID(evaluationMasterID: number): Observable<any> {
    const url = `${this.apiUrl}/eval/${evaluationMasterID}`;
    return this.http.get(url, this.getHeaders());
  }

  getEvaluationMasterByUserID(userID: number): Observable<any> {
    const url = `${this.apiUrl}/user/${userID}`;
    return this.http.get(url, this.getHeaders());
  }

  deactivateEvaluationMaster(evaluationMasterID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${evaluationMasterID}`;
    return this.http.put(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteEvaluationMaster(evaluationMasterID: number): Observable<any> {
    const url = `${this.apiUrl}/${evaluationMasterID}`;
    return this.http.delete(url, this.getHeaders());
  }
}