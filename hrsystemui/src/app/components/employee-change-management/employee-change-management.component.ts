import {
  Component,
  OnInit,
  ViewContainerRef,
  Type,
  ChangeDetectorRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { RouterModule } from '@angular/router';
import { EmployeeChangeRecordComponent } from '../employee-change-record/employee-change-record.component';
import { EmployeeChangeViewComponent } from '../employee-change-view/employee-change-view.component';

@Component({
  selector: 'app-employee-change-management',
  standalone: true,
  imports: [ToolbarModule, RouterModule, TabViewModule, CommonModule],
  templateUrl: './employee-change-management.component.html',
  styleUrls: ['./employee-change-management.component.css'],
})
export class EmployeeChangeManagementComponent implements OnInit {
  @ViewChildren('dynamicContainer', { read: ViewContainerRef })
  dynamicContainers!: QueryList<ViewContainerRef>;

  constructor(private cdr: ChangeDetectorRef) {}

  tabs: { title: string; component: Type<any> }[] = [];
  activeTabIndex: number = 0;

  ngOnInit() {
    this.tabs = [
      { title: 'Cambio de Posición', component: EmployeeChangeRecordComponent },
      { title: 'Cambios Pendientes', component: EmployeeChangeViewComponent },
    ];
  }

  ngAfterViewInit() {
    this.loadComponent(this.tabs[this.activeTabIndex].component);
  }

  onTabChange() {
    const selectedTab = this.tabs[this.activeTabIndex];
    this.loadComponent(selectedTab.component);
  }

  loadComponent(component: Type<any>) {
    const container = this.dynamicContainers.toArray()[this.activeTabIndex];
    if (container) {
      container.clear();
      container.createComponent(component);
      this.cdr.detectChanges();
    }
  }
}