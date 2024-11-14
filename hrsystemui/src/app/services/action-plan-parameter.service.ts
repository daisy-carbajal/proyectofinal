import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanParameterService {

  private apiUrl = 'http://localhost:3000/action-plan-param';

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

  postActionPlanParameter(parameter: any): Observable<any> {
    return this.http.post(this.apiUrl, parameter, this.getHeaders());
  }

  getActionPlanParametersByActionPlanID(actionPlanID: number): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanID}`;
    return this.http.get(url, this.getHeaders());
  }

  updateActionPlanParameter(actionPlanParameterID: number, updatedParameter: any): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanParameterID}`;
    return this.http.put(url, updatedParameter, this.getHeaders());
  }

  deleteActionPlanParameter(actionPlanParameterID: number): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanParameterID}`;
    return this.http.delete(url, this.getHeaders());
  }
}