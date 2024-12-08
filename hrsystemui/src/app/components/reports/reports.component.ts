import { Component } from '@angular/core';
import { SafeUrlPipe } from '../../guards/safe-url.pipes'; // Ruta al Pipe

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SafeUrlPipe], // Importa el Pipe aquí
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  embedUrl: string =
    'https://app.powerbi.com/view?r=eyJrIjoiODA2YjgwMGUtM2NlNC00NGUxLWJiYjUtMWQ0NWNiYmU2NjUyIiwidCI6ImFmMmZkMTk2LTFkOWYtNDdiNC05MDY5LTM5MWE0NmY4MzYwMSIsImMiOjR9'; // Reemplaza con tu enlace público

  constructor() {}
}