import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface UserNameResponse {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
        'X-User-ID': this.getUserId()?.toString() || '',
        'X-Role-ID': this.getRoleId()?.toString() || ''
      })
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
      Authorization: `Bearer ${this.getToken()}`
    };
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, credentials, { headers, withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.token && typeof localStorage !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('roleId', response.roleId.toString());

          const expiresIn = credentials.rememberMe
            ? 30 * 24 * 60 * 60 * 1000
            : 60 * 60 * 1000; // 30 días o 1 hora
          localStorage.setItem(
            'tokenExpiry',
            (Date.now() + expiresIn).toString()
          );

          console.log('UserID en login:', response.userId);
          this.createSession(Number(response.userId), response.token).subscribe(
            {
              next: (res) => console.log('Sesión creada:', res),
              error: (err) => console.error('Error al crear la sesión:', err),
            }
          );
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
    if (typeof localStorage !== 'undefined') {
      const userId = localStorage.getItem('userId');
      return userId ? Number(userId) : null;
    }
    return null;
  }

  getUserFirstandLastName(): Observable<UserNameResponse> {
    const userId = this.getUserId();
    const url = `${this.apiUrl}/get-name/${userId}`;
    return this.http.get<UserNameResponse>(url, this.getHeaders());
  }

  getRoleId(): number | null {
    if (typeof localStorage !== 'undefined') {
      const roleId = localStorage.getItem('roleId');
      return roleId ? Number(roleId) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  logout(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    const userId = this.getUserId();
    const token = this.getToken();

    const body = { userId: Number(userId), token };

    return this.http.post(url, body, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleId');
        localStorage.removeItem('tokenExpiry');
      })
    );
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
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
}
