import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class NotificationSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Cambia esto si usas un dominio o puerto diferente
  }

  registerUser(userId: number) {
    this.socket.emit('register_user', userId);
  }

  onNewNotification(callback: (data: any) => void) {
    this.socket.on('new_notification', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}