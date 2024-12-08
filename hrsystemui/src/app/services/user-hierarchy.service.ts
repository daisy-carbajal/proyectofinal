import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserHierarchyService {
  private apiUrl = 'http://localhost:3000/user-hierarchy';  // Ajusta la URL de tu API

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

  // Crear jerarquía de usuario
  postUserHierarchy(userHierarchy: any): Observable<any> {
    return this.http.post(this.apiUrl, userHierarchy, this.getHeaders());
  }

  // Obtener todas las jerarquías de usuarios
  getAllUserHierarchies(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  // Obtener jerarquía de usuario por ID
  getUserHierarchyById(userHierarchyId: number): Observable<any> {
    const url = `${this.apiUrl}/${userHierarchyId}`;
    return this.http.get(url, this.getHeaders());
  }

  // Actualizar jerarquía de usuario
  updateUserHierarchy(
    userHierarchyId: number,
    updatedUserHierarchy: any
  ): Observable<any> {
    const url = `${this.apiUrl}/${userHierarchyId}`;
    return this.http.put(url, updatedUserHierarchy, this.getHeaders());
  }

  // Desactivar jerarquía de usuario
  deactivateUserHierarchy(userHierarchyId: number): Observable<any> {
    const url = `${this.apiUrl}/${userHierarchyId}`;
    return this.http.patch(url, null, this.getHeaders());
  }

  // Eliminar jerarquía de usuario
  deleteUserHierarchy(userHierarchyId: number): Observable<any> {
    const url = `${this.apiUrl}/${userHierarchyId}`;
    return this.http.delete(url, this.getHeaders());
  }
}
