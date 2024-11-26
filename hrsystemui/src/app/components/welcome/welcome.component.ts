import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { HomeHeaderComponent } from '../home-header/home-header.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    DividerModule,
    HomeHeaderComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
