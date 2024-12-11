import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-permission',
  standalone: true,
  imports: [],
  templateUrl: './location-permission.component.html',
  styleUrl: './location-permission.component.css'
})
export class LocationPermissionComponent {

  userLocation: any;
  formattedLocation: any;

  constructor(private router: Router) {}

  grantPermission() {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = [position.coords.latitude, position.coords.longitude];
          this.formattedLocation = `${this.userLocation[0].toFixed(3)},${this.userLocation[1].toFixed(3)}`;
          localStorage.setItem('userLocation', this.formattedLocation);
          this.router.navigate(['/maps']);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );

      // navigator.geolocation.getCurrentPosition(() => {
      //   this.router.navigate(['/maps']);
      // });
    }
  }
}
