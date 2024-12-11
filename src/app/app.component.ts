import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapsComponent } from "./mapple/maps/maps.component";
import { NewMapComponent } from "./mapple/new-map/new-map.component";
import { TestMapComponent } from "./mapple/test-map/test-map.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { NearbySearchComponent } from "./mapple/nearby-search/nearby-search.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapsComponent, NewMapComponent, TestMapComponent, WelcomeComponent, NearbySearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eno-kumbh-maps';
}
