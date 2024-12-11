import { Component, OnInit } from '@angular/core';
import { mappls, mappls_plugin } from 'mappls-web-maps';

@Component({
  selector: 'app-test-map',
  standalone: true,
  imports: [],
  templateUrl: './test-map.component.html',
  styleUrl: './test-map.component.css'
})
export class TestMapComponent
implements OnInit {
  mapObject: any;
  mapplsClassObject = new mappls();
  mapplsPluginObject = new mappls_plugin();
  // userLocation: any;
  formattedLocation: any;
  savedDestination = localStorage.getItem('destination');
  userLocation = localStorage.getItem('userLocation');
  private token: string = '61ded60d-d48e-446e-88c9-fd47d56619a3';

  mapProps = {
    center: [28.633, 77.2194],
    traffic: false,
    zoom: 4,
    geolocation: false,
    clickableIcons: false,
  };

  ngOnInit() {

    const loadObject = {
      map: true,
      plugins: ['direction'],
    };

    // this.getUserCurrentLocation();

    this.mapplsClassObject.initialize(
      this.token,
      loadObject,
      () => {
        this.mapObject = this.mapplsClassObject.Map({
          id: 'map',
          properties: this.mapProps,
        });

        this.mapObject.on('load', () => {
          var direction_option = {
            Resource: 'route_eta',
            annotations: 'nodes,congestion',
            map: this.mapObject,

            start: this.userLocation,
            end: this.savedDestination,

          };
          this.mapplsPluginObject.direction(direction_option, (e: any) => {
            console.log(e);
          });
        });
      }
      );
    }

    // getUserCurrentLocation() {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.userLocation = [position.coords.latitude, position.coords.longitude];

    //     this.formattedLocation = `${this.userLocation[0].toFixed(3)},${this.userLocation[1].toFixed(3)}`;
    //     console.log(this.formattedLocation); // Output: '10.015,76.299'

    //     console.log(this.userLocation);
    //   });
    // }
  }
