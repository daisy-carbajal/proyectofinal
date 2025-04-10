import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

interface UserNameResponse {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  private getHeaders(): { headers: HttpHeaders } {
    const headersConfig: { [key: string]: string } = {
      Authorization: `Bearer ${this.getToken()}`,
    };

    const userId = this.getUserId();
    if (userId) {
      headersConfig['X-User-ID'] = userId.toString();
    }

    const roleId = this.getRoleId();
    if (roleId) {
      headersConfig['X-Role-ID'] = roleId.toString();
    }

    return {
      headers: new HttpHeaders(headersConfig),
    };
  }

  completeRegistration(
    token: string,
    tempPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const url = `${this.apiUrl}/complete-registration`;
    const body = {
      token,
      tempPassword,
      newPassword,
      confirmPassword,
    };
    return this.http.post(url, body);
  }

  login(credentials: {
    workEmail: string;
    password: string;
    rememberMe: boolean;
  }): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.getToken()}`,
    };
    const url = `${this.apiUrl}/login`;

    return this.http
      .post(url, credentials, { headers, withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            const storage = credentials.rememberMe
              ? localStorage
              : sessionStorage;

            // Guarda los datos en localStorage o sessionStorage según la preferencia
            storage.setItem('token', response.token);
            storage.setItem('userId', response.userId.toString());
            storage.setItem('roleId', response.roleId.toString());

            const expiresIn = credentials.rememberMe
              ? 30 * 24 * 60 * 60 * 1000 // 30 días
              : 60 * 60 * 1000; // 1 hora
            storage.setItem('tokenExpiry', (Date.now() + expiresIn).toString());

            console.log('UserID en login:', response.userId);

            // Crea la sesión
            this.createSession(
              Number(response.userId),
              response.token
            ).subscribe({
              next: (res) => console.log('Sesión creada:', res),
              error: (err) => console.error('Error al crear la sesión:', err),
            });
          }
        })
      );
  }

  private createSession(userId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/create-session`;
    const body = { userId, token };
    console.log('UserID en createSession:', userId);
    console.log('Token en createSession:', token);
    return this.http.post(url, body);
  }

  getUserId(): number | null {
    const userId =
      localStorage.getItem('userId') || sessionStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }

  getRoleId(): number | null {
    const roleId =
      localStorage.getItem('roleId') || sessionStorage.getItem('roleId');
    return roleId ? Number(roleId) : null;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const tokenExpiry =
        localStorage.getItem('tokenExpiry') ||
        sessionStorage.getItem('tokenExpiry');

      if (token && tokenExpiry) {
        const isTokenValid = Date.now() < Number(tokenExpiry);
        if (isTokenValid) {
          return token;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('tokenExpiry');
          return null;
        }
      }
    }
    return null;
  }

  getUserFirstandLastName(): Observable<UserNameResponse> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID is not available');
    }

    const url = `${this.apiUrl}/get-name/${userId}`;
    return this.http.get<UserNameResponse>(url, this.getHeaders());
  }

  getUserPermissions(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID is not available');
    }
    const url = `${this.apiUrl}/get-permissions/${userId}`;
    return this.http.get<any>(url, this.getHeaders()).pipe(
      tap((response) => {
        console.log("Permisos del usuario:", response);
      }),
      catchError((error) => {
        console.error("Error al obtener permisos:", error);
        return throwError(() => error);
      })
    );
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (token && tokenExpiry) {
        const isTokenValid = Date.now() < Number(tokenExpiry);

        if (!isTokenValid) {
          // Si el token ha expirado, limpia los datos relacionados
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('roleId');
          localStorage.removeItem('tokenExpiry');
        }

        return isTokenValid; // Devuelve si el token sigue siendo válido
      }
    }

    return false; // No hay token o no hay expiración almacenada
  }

  logout(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    const userId = this.getUserId();
    const token = this.getToken();

    const body = { userId: Number(userId), token };

    return this.http.post(url, body, { withCredentials: true }).pipe(
      tap(() => {
        // Limpia ambas memorias para evitar problemas con sesiones múltiples
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleId');
        localStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('roleId');
        sessionStorage.removeItem('tokenExpiry');
      })
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    const url = `${this.apiUrl}/request-password-reset`;
    const body = { personalEmail: email };
    return this.http.post(url, body);
  }

  resetPassword(
    token: string,
    tempPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const url = `${this.apiUrl}/reset-password`;
    const body = {
      token,
      tempPassword,
      newPassword,
      confirmPassword,
    };

    return this.http.post(url, body);
  }

  validateSession(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('headers:', headers);

    return this.http.get(`${this.apiUrl}/validate-token`, {
      headers,
      withCredentials: true,
    }) .pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleId');
        localStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('roleId');
        sessionStorage.removeItem('tokenExpiry');
        }
        return throwError(() => error);
      })
    );
  }
}
