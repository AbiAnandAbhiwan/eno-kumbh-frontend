import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { mappls, mappls_plugin } from 'mappls-web-maps';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  mapObject: any;
  marker: any; // This will be used for user location
  destinationMarker: any; // This will be used for the searched destination
  userLocation: any;
  infowindowObject: any;
  callback: any;
  mapplsClassObject: any = new mappls();
  mapplsPluginObject: any = new mappls_plugin();
  title = 'Map_angular';

  mapProps = {
    center: [28.633, 77.2194],
    traffic: false,
    zoom: 4,
    geolocation: true,
    clickableIcons: false,
  };

  ngOnInit(): void {
    const loadObject = {
      map: true,
      layer: 'vector',
      version: '3.5',
      libraries: ['airspacelayers'],
      plugins: ['direction', 'search', 'location'],
    };

    // Initialize the Mappls class
    this.mapplsClassObject.initialize(
      'fe349d65-03c0-4b0b-86ee-fe7340f4426b',
      loadObject,
      () => {
        // Map is initialized successfully, call the method to set up the map
        this.initializeMap();
        this.initializeSearch(); // Search functionality if needed
      }
    );
  }

  initializeMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = [position.coords.latitude, position.coords.longitude];

          // Initialize the map object here, only after location is retrieved
          this.mapObject = this.mapplsClassObject.Map({
            id: 'map', // ID of the map container
            properties: {
              center: this.userLocation,
              zoomControl: true,
              location: true,
              geolocation: true,
              clickableIcons: true,
            },

          });

          this.mapObject.on("load", ()=>{

            this.mapplsClassObject.setStyle("standard-hybrid");

            })

          // Create the user location marker
          this.marker = this.mapplsClassObject.Marker({
            map: this.mapObject,
            position: this.userLocation,
            icon: '/assets/images/place.png',
            width: 50,
            height: 50,
            popupHtml: 'You are Here',
            popupOptions: {
              openPopup: true,
            },
          });

          // After map is initialized, set up the InfoWindow
          // this.initializeInfoWindow();
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  initializeSearch(): void {
    const optional_config = {
      location: [28.61, 77.23],
      distance: true,
      geolocation: true,
      region: 'IND',
      height: 300,
    };

    this.callback = (data: any): void => {
      console.log('Search results:', data);
      if (data) {
        const dt = data[0];
        if (!dt) {
          return; // Early exit if no data found
        }
        const eloc = dt.eLoc;
        const place = `${dt.placeName}, ${dt.placeAddress}`;

        // Check if a destination marker already exists
        if (this.destinationMarker) {
          this.destinationMarker.remove();
        }

        // Create a new marker for the destination
        this.destinationMarker = this.mapplsPluginObject.pinMarker({
          map: this.mapObject,
          pin: eloc,
          popupHtml: place,
          popupOptions: {
            openPopup: true,
          },
        });

        // Optionally, zoom the map to the new location
        if (eloc && eloc[0] && eloc[1]) {
          this.mapObject.setView(eloc, 50);
        } else {
          console.error('Invalid destination coordinates:', eloc);
        }
      }
    };

    this.mapplsPluginObject.search(
      document.getElementById('auto'),
      optional_config,
      this.callback
    );
  }

}
