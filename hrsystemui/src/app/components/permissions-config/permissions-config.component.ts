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
import { PermissionsViewComponent } from '../permissions-view/permissions-view.component';
import { PermissionCategoryComponent } from '../permission-category/permission-category.component';

@Component({
  selector: 'app-permissions-config',
  standalone: true,
  imports: [ToolbarModule, RouterModule, TabViewModule, CommonModule],
  templateUrl: './permissions-config.component.html',
  styleUrls: ['./permissions-config.component.css'],
})
export class PermissionsConfigComponent implements OnInit {
  @ViewChildren('dynamicContainer', { read: ViewContainerRef })
  dynamicContainers!: QueryList<ViewContainerRef>;

  constructor(private cdr: ChangeDetectorRef) {}

  tabs: { title: string; component: Type<any> }[] = [];
  activeTabIndex: number = 0;

  ngOnInit() {
    this.tabs = [
      { title: 'Lista de Permisos', component: PermissionsViewComponent },
      { title: 'Categorías', component: PermissionCategoryComponent },
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