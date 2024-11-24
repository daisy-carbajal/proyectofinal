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
  selector: 'app-new-da',
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
    CalendarModule,
  ],
  providers: [UserService],
  templateUrl: './new-da.component.html',
  styleUrl: './new-da.component.css',
})
export class NewDAComponent implements OnInit {
  users: any[] = [];
  userSelected: number | null = null;
  showDetalles: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  da: any = {
    EmployeeUserID: null,
    ReportedByUserID: null,
    DateApplied: null,
    DisciplinaryActionReasonID: null,
    WarningID: null,
    Description: '',
    ActionTaken: '',
    Tasks: [],
  };

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
    console.log('Agregando tarea.');
    this.da.Tasks.push({
      Task: '',
      FollowUpDate: null,
      Status: '',
    });
    this.showDetalles = true;
  }

  removeTask(index: number) {
    this.da.Tasks.splice(index, 1);

    if (this.da.Tasks.length === 0) {
      this.showDetalles = false;
    }
  }
}
