import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
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
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-new-action-plan',
  standalone: true,
  imports: [
    ChipsModule,
    CardModule,
    RippleModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    EditorModule,
    CalendarModule
  ],
  providers: [UserService],
  templateUrl: './new-action-plan.component.html',
  styleUrl: './new-action-plan.component.css'
})
export class NewActionPlanComponent implements OnInit {

  users: any[] = [];
  userSelected: number | null = null;
  showDetallesTasks: boolean = false;
  showDetallesParameters: boolean = false;

  actionPlan: any = {
    AppliedByUserID: null,
    EmployeeUserID: null,
    FocusArea: '',
    StartDate: null,
    EndDate: null,
    ActionPlanStatus: null,
    Summary: '',
    Goal: '',
    SuccessArea: '',
    OpprtunityArea: '',
    Impact: '',
    RootCauseAnalysis: '',
    Strategies: '',
    Comments: '',
    Parameters: [],
    Tasks: []    
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (dataUser) => {
        console.log('Datos de usuaros:', dataUser);
        this.users = dataUser;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  onUserSelected(event: any) {
    this.userSelected = event.value;
    console.log('ID del Usuario seleccionado:', this.userSelected);
  }

  addTask() {
    console.log("Agregando tarea.");
    this.actionPlan.Tasks.push({
      Task: '',
      FollowUpDate: null,
      Status: '',
    });
    this.showDetallesTasks = true;
  }

  removeTask(index: number) {
    this.actionPlan.Tasks.splice(index, 1);
    if(this.actionPlan.Tasks.length === 0) {
      this.showDetallesTasks = false;
    }
  }

  addParameter() {
    console.log("Agregando tarea.");
    this.actionPlan.Parameters.push({
      ParameterID: null,
      CurrentScore: 0,
      GoalScore: 0,
      GoalAcquired: null,
      GoalStatus: '',
    });
    this.showDetallesParameters = true;
  }

  removeParameter(index: number) {
    this.actionPlan.Parameters.splice(index, 1);
    if(this.actionPlan.Parameters.length == 0) {
      this.showDetallesParameters = false;
    }
  }
}
