import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeHeaderComponent } from '../home-header/home-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ NavbarComponent, CommonModule, RouterModule, HomeHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
