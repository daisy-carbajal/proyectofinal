import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationCalificationService {

  private apiUrl = 'http://localhost:3000/eval-calification';

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

  postEvaluationCalification(calification: any): Observable<any> {
    return this.http.post(this.apiUrl, calification, this.getHeaders());
  }

  getAllEvaluationCalifications(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  updateEvaluationCalification(calificationID: number, updatedCalification: any): Observable<any> {
    const url = `${this.apiUrl}/u/${calificationID}`;
    return this.http.put(url, updatedCalification, this.getHeaders());
  }

  deactivateEvaluationCalification(calificationID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${calificationID}`;
    return this.http.patch(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteEvaluationCalification(calificationID: number): Observable<any> {
    const url = `${this.apiUrl}/${calificationID}`;
    return this.http.delete(url, this.getHeaders());
  }
}