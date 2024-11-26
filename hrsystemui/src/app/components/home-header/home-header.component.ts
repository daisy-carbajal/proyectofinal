import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [ButtonModule, RippleModule, CommonModule],
  providers: [AuthService],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.css',
})
export class HomeHeaderComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  currentTime: string = '';
  currentImage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserFirstandLastName().subscribe({
      next: (data) => {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
      },
      error: (err) =>
        console.error('Error fetching user name and surname:', err),
    });
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = this.formatTime(now);

    const hours = now.getHours();
    if (hours >= 4 && hours < 6) {
      this.currentImage = '../../../assets/sunrise.png';
    } else if (hours >= 6 && hours < 13) {
      this.currentImage = '../../../assets/sun.png';
    } else if (hours >= 13 && hours < 18) {
      this.currentImage = '../../../assets/sunset.png';
    } else {
      this.currentImage = '../../../assets/moon.png';
    }
  }

  formatTime(date: Date): string {
    let hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';

    // Convertir a formato de 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe ser '12'

    const strMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${hours}:${strMinutes} ${ampm}`;
  }
}
