import {
  Component,
  OnInit,
  ViewChild,
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
import { EvaluationCalificationComponent } from '../evaluation-calification/evaluation-calification.component';
import { EvaluationTypeComponent } from '../evaluation-type/evaluation-type.component';
import { EvaluationParameterComponent } from '../evaluation-parameter/evaluation-parameter.component';

@Component({
  selector: 'app-evaluation-configuration',
  standalone: true,
  imports: [ToolbarModule, RouterModule, TabViewModule, CommonModule],
  templateUrl: './evaluation-configuration.component.html',
  styleUrls: ['./evaluation-configuration.component.css'],
})
export class EvaluationConfigurationComponent implements OnInit {
  @ViewChildren('dynamicContainer', { read: ViewContainerRef })
  dynamicContainers!: QueryList<ViewContainerRef>;

  constructor(private cdr: ChangeDetectorRef) {}

  tabs: { title: string; component: Type<any> }[] = [];
  activeTabIndex: number = 0;

  ngOnInit() {
    this.tabs = [
      { title: 'Tipos', component: EvaluationTypeComponent },
      { title: 'Calificaciones', component: EvaluationCalificationComponent },
      { title: 'Parámetros', component: EvaluationParameterComponent },
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