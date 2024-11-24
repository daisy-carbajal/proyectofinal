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
import { DaReasonViewComponent } from '../da-reason-view/da-reason-view.component';
import { DaWarningLevelViewComponent } from '../da-warning-level-view/da-warning-level-view.component';

@Component({
  selector: 'app-da-configuration',
  standalone: true,
  imports: [ToolbarModule, RouterModule, TabViewModule, CommonModule],
  templateUrl: './da-configuration.component.html',
  styleUrls: ['./da-configuration.component.css'],
})
export class DaConfigurationComponent implements OnInit {
  @ViewChildren('dynamicContainer', { read: ViewContainerRef })
  dynamicContainers!: QueryList<ViewContainerRef>;

  constructor(private cdr: ChangeDetectorRef) {}

  tabs: { title: string; component: Type<any> }[] = [];
  activeTabIndex: number = 0;

  ngOnInit() {
    this.tabs = [
      { title: 'Razones', component: DaReasonViewComponent },
      { title: 'Advertencias', component: DaWarningLevelViewComponent },
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