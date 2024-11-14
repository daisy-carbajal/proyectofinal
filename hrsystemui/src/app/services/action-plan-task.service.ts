import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanTaskService {

  private apiUrl = 'http://localhost:3000/action-plan-task';

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

  postActionPlanTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, this.getHeaders());
  }

  getActionPlanTasksByActionPlanID(actionPlanID: number): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanID}`;
    return this.http.get(url, this.getHeaders());
  }

  updateActionPlanTask(actionPlanTaskID: number, updatedTask: any): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanTaskID}`;
    return this.http.put(url, updatedTask, this.getHeaders());
  }

  deactivateActionPlanTask(actionPlanTaskID: number, deletedBy: any): Observable<any> {
    const url = `${this.apiUrl}/d/${actionPlanTaskID}`;
    return this.http.put(url, { DeletedBy: deletedBy }, this.getHeaders());
  }

  deleteActionPlanTask(actionPlanTaskID: number): Observable<any> {
    const url = `${this.apiUrl}/${actionPlanTaskID}`;
    return this.http.delete(url, this.getHeaders());
  }
}