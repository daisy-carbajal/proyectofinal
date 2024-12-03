import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserPreferenceService {
  private apiUrl = 'http://localhost:3000/user-preference';

  constructor(private http: HttpClient) {}

  savePreferences(
    userId: number,
    preferences: { push: boolean; email: boolean }
  ) {
    return this.http.post(this.apiUrl, {
      userId,
      enablePushNotifications: preferences.push,
      enableEmailNotifications: preferences.email,
    });
  }

  getPreferences(userId: number) {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url)
  }
}
