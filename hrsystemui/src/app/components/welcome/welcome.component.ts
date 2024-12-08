import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { SummaryService } from '../../services/summary.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    DividerModule,
    HomeHeaderComponent,
    RouterModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  activeIncidentsCount: number = 0;
  unreviewedEvaluationsCount: number = 0;
  unacknowledgedActionsCount: number = 0;
  todayCommentsCount: number = 0;

  constructor(private summaryService: SummaryService) {}

  ngOnInit(): void {
    this.loadActiveIncidentsCount();
    this.loadUnreviewedEvaluationsCount();
    this.loadUnacknowledgedActionsCount();
    this.loadTodayCommentsCount();
  }

  loadActiveIncidentsCount(): void {
    this.summaryService.getActiveIncidentsCount().subscribe({
      next: (data) => {
        this.activeIncidentsCount = data.PendingToReviewIncidents || 0; // Cambiar según la respuesta del backend
      },
      error: (err) => {
        console.error('Error fetching active incidents count:', err);
      }
    });
  }

  loadUnreviewedEvaluationsCount(): void {
    this.summaryService.getUnreviewedEvaluationsCount().subscribe({
      next: (data) => {
        this.unreviewedEvaluationsCount = data.UnreviewedEvaluations || 0; // Cambiar según la respuesta del backend
      },
      error: (err) => {
        console.error('Error fetching unreviewed evaluations count:', err);
      }
    });
  }

  loadUnacknowledgedActionsCount(): void {
    this.summaryService.getUnacknowledgedActionsCount().subscribe({
      next: (data) => {
        this.unacknowledgedActionsCount = data.UnacknowledgedActions || 0; // Cambiar según la respuesta del backend
      },
      error: (err) => {
        console.error('Error fetching unacknowledged actions count:', err);
      }
    });
  }

  loadTodayCommentsCount(): void {
    this.summaryService.getTodayCommentsCount().subscribe({
      next: (data) => {
        this.todayCommentsCount = data.TodayComments || 0; // Cambiar según la respuesta del backend
      },
      error: (err) => {
        console.error('Error fetching today comments count:', err);
      }
    });
  }
}

