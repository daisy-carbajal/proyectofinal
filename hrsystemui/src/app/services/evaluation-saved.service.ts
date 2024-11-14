import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationSavedService {

  private apiUrl = 'http://localhost:3000/eval-saved';

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

  postEvaluationSaved(evaluation: any): Observable<any> {
    return this.http.post(this.apiUrl, evaluation, this.getHeaders());
  }

  getAllEvaluationSaved(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getEvaluationSavedFiltered(departmentID?: number, typeID?: number): Observable<any> {
    const params: any = {};
    if (departmentID) params.DepartmentID = departmentID;
    if (typeID) params.TypeID = typeID;
    const url = `${this.apiUrl}/filtered`;
    return this.http.get(url, { ...this.getHeaders(), params });
  }

  deactivateEvaluationSaved(id: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${id}`;
    return this.http.put(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteEvaluationSaved(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getHeaders());
  }
}