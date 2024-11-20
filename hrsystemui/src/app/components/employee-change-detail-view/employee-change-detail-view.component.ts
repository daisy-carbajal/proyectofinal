import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobtitleChangeService } from '../../services/job-title-change.service';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-userdetailview',
  standalone: true,
  imports: [
    CardModule,
    RippleModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, UserService],
  templateUrl: './employee-change-detail-view.component.html',
  styleUrls: ['./employee-change-detail-view.component.css'],
})
export class EmployeeChangeDetailViewComponent implements OnInit {
  employeeName = '';
  userId!: number;
  currentJobTitle = '';
  currentDepartment = '';
  pendingJobTitle = '';
  pendingJobTitleChangeID = 0;
  pendingDepartment = '';
  pendingDepartmentChangeID = 0;
  changeStartDate: Date | null = null;
  pendingChange: any;
  changeReason = '';

  constructor(
    private jobTitleChangeService: JobtitleChangeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('User ID:', id); // Debugging
      if (id) {
        this.userId = +id;
        this.loadCurrentDetails(this.userId);
        this.loadPendingChanges(this.userId);
      }
    });
  }

  goBackToChanges(): void {
    this.router.navigate(['/home/user/change'], { replaceUrl: true });
  }

  loadCurrentDetails(userId: number): void {
    this.jobTitleChangeService
      .getCurrentDetailsByID(userId)
      .subscribe((dataCurrent) => {
        if (dataCurrent.length > 0) {
          // Si el array no está vacío
          this.currentJobTitle = dataCurrent[0].JobTitleTitle;
          this.currentDepartment = dataCurrent[0].DepartmentName;
          this.employeeName = dataCurrent[0].UserName;
        }
      });
  }

  loadPendingChanges(userId: number): void {
    this.jobTitleChangeService
      .getPendingChangesByID(userId)
      .subscribe((dataPending) => {
        if (dataPending.length > 0) {
          console.log(dataPending);
          this.pendingChange = dataPending[0];
          this.pendingJobTitle = dataPending[0].JobTitleTitle;
          this.pendingDepartment = dataPending[0].DepartmentName;
          this.changeStartDate = new Date(dataPending[0].JobTitleChangeStartDate);
          this.pendingDepartmentChangeID = dataPending[0].DepartmentChangeID;
          this.pendingJobTitleChangeID = dataPending[0].JobTitleChangeID;
          this.changeReason = dataPending[0].JobTitleChangeReason;
        }
      });
  }

  approveChange(pendingChange: any) {
    const infoChange = {
      DepartmentChangeID: pendingChange.DepartmentChangeID,
      JobTitleChangeID: pendingChange.JobTitleChangeID,
      UserID: this.userId,
    };

    this.jobTitleChangeService
      .approveChanges(infoChange.UserID, infoChange)
      .subscribe(
        (response) => {
          console.log('Cambio de título aprobado:', response);
          this.loadPendingChanges(this.userId);
          this.goBackToChanges();
        },
        (error) => {
          console.error('Error al aprobar el cambio de título:', error);
        }
      );
  }

  denyChange(pendingChange: any) {
    const infoChange = {
      DepartmentChangeID: pendingChange.DepartmentChangeID,
      JobTitleChangeID: pendingChange.JobTitleChangeID,
      UserID: this.userId,
    };

    this.jobTitleChangeService
      .denyChanges(infoChange.UserID, infoChange)
      .subscribe(
        (response) => {
          console.log('Cambio de título denegado:', response);
          this.loadPendingChanges(this.userId);
          this.goBackToChanges();
        },
        (error) => {
          console.error('Error al denegar el cambio de título:', error);
        }
      );
  }
}
