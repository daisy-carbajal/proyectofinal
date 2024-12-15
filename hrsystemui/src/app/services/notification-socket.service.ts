import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class NotificationSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });
  }

  registerUser(userId: number) {
    this.socket.emit('register_user', userId);
  }

  onNewNotification(callback: (data: any) => void) {
    this.socket.on('new_notification', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.off('new_notification'); // Remueve el listener
      this.socket.disconnect();
    }
  }
}
