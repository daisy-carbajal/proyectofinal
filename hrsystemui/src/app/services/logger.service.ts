import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private apiUrl ='http://localhost:3000/logs'

  constructor(private http: HttpClient) {}

  log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const logData = { message, level, timestamp: new Date().toISOString() };
    
    switch (level) {
      case 'info':
        console.info(`[INFO] ${message}`);
        break;
      case 'warn':
        console.warn(`[WARN] ${message}`);
        break;
      case 'error':
        console.error(`[ERROR] ${message}`);
        break;
    }
  }
}
