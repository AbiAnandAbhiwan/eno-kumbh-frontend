import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  constructor(private router: Router) {}

  selectCategory(category: string) {
    localStorage.setItem('userQuery', category);
    this.router.navigate(['/location-permission']);
  }
}
