import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanService {

  private apiUrl = 'http://localhost:3000/action-plan';

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

  postActionPlan(actionPlan: any): Observable<any> {
    return this.http.post(this.apiUrl, actionPlan, this.getHeaders());
  }

  getAllActionPlans(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  getActionPlansByUserID(userID: number): Observable<any> {
    const url = `${this.apiUrl}/user/${userID}`;
    return this.http.get(url, this.getHeaders());
  }

  updateActionPlan(actionPlanID: number, updatedActionPlan: any): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanID}`;
    return this.http.put(url, updatedActionPlan, this.getHeaders());
  }

  deactivateActionPlan(actionPlanID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/deactivate/${actionPlanID}`;
    return this.http.patch(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteActionPlan(actionPlanID: number): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanID}`;
    return this.http.delete(url, this.getHeaders());
  }
}