import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:3000/files';

  constructor(private http: HttpClient) {}

  uploadUserFile(userId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post(`${this.apiUrl}/${userId}/upload`, formData);
  }
  
  getUserFiles(userId: number) {
    return this.http.get<{ name: string, url: string }[]>(`${this.apiUrl}/${userId}/files`);
  }
  
  deleteUserFile(userId: number, fileName: string) {
    return this.http.delete(`${this.apiUrl}/${userId}/files/${fileName}`);
  }

  getSignedFileUrl(userId: number, fileName: string) {
    return this.http.get<{ url: string }>(`${this.apiUrl}/${userId}/files/${fileName}/signedUrl`);
  }
  
  viewFile(userId: number, fileName: string) {
    this.getSignedFileUrl(userId, fileName).subscribe(response => {
      window.open(response.url, "_blank");
    });
  }
}
