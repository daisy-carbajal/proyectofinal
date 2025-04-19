import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {

  private apiUrl = 'http://localhost:3000/user-hierarchy'; // URL base del endpoint

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para configurar encabezados con autenticación y datos de usuario
  private getHeaders(): { headers: HttpHeaders } {
    const headers = new HttpHeaders();

    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
    const roleId = this.authService.getRoleId();
  
    let finalHeaders = headers;
    if (token) finalHeaders = finalHeaders.set('Authorization', `Bearer ${token}`);
    if (userId) finalHeaders = finalHeaders.set('X-User-ID', userId.toString());
    if (roleId) finalHeaders = finalHeaders.set('X-Role-ID', roleId.toString());
  
    return { headers: finalHeaders };
  }

  // Obtener todas las jerarquías de usuario
  getAllUserHierarchies(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  // Crear una nueva jerarquía de usuario
  createUserHierarchy(userHierarchy: any): Observable<any> {
    return this.http.post(this.apiUrl, userHierarchy, this.getHeaders());
  }

  // Actualizar una jerarquía de usuario existente
  updateUserHierarchy(hierarchyId: number, updatedHierarchy: any): Observable<any> {
    const url = `${this.apiUrl}/${hierarchyId}`;
    return this.http.put(url, updatedHierarchy, this.getHeaders());
  }

  // Desactivar una jerarquía de usuario
  deactivateUserHierarchy(hierarchyId: number): Observable<any> {
    const url = `${this.apiUrl}/${hierarchyId}`;
    return this.http.patch(url, {}, this.getHeaders());
  }

  // Eliminar una jerarquía de usuario
  deleteUserHierarchy(hierarchyId: number): Observable<any> {
    const url = `${this.apiUrl}/${hierarchyId}`;
    return this.http.delete(url, this.getHeaders());
  }
}
