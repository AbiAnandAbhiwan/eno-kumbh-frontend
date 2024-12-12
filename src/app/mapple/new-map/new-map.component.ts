import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mappls, mappls_plugin } from 'mappls-web-maps';

@Component({
  selector: 'app-new-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-map.component.html',
  styleUrls: ['./new-map.component.css'],
})
export class NewMapComponent implements OnInit {
  userQuery: string | null = '';
  mapObject: any;
  marker: any;
  selectedELoc: string | null = null; // Track selected eLoc for getDirections2
  userLocation = localStorage.getItem('userLocation');
  searchLocation: any;
  mapProps: any;
  formattedLocation: any;
  mapplsClassObject: any = new mappls();
  mapplsPluginObject: any = new mappls_plugin();
  title = 'Map_angular';
  token = '7a11c5f0-b974-45b7-bab0-08f1775130aa';

  constructor(private router: Router){}

  ngOnInit() {
    this.userQuery = localStorage.getItem('userQuery');
    this.userLocation = localStorage.getItem('userLocation');
    
    const loadObject = {
      map: true,
      layer: 'raster', // Optional Default Vector
      libraries: ['airspacelayers'], // Optional for Polydraw and airspaceLayers
      plugins: ['direction', 'search', 'pinMarker', 'nearby', 'getPinDetails'], // Optional for any plugins
    };
    (window as any).getDirectionsHandler = this.getDirections.bind(this);

    // this.getUserCurrentLocation();
    this.mapProps = {
      center: this.userLocation,
      traffic: false,
      zoom: 4,
      geolocation: false,
      clickableIcons: true,
    };
    this.initializeMap(loadObject);
    this.nearbyLocations();
    this.searchPlaceAndMark(loadObject);
    // this.getDirections('JUJ4UL');
  }

  initializeMap(loadObject: any): void {
    this.mapplsClassObject.initialize(this.token, loadObject, () => {
      this.mapObject = this.mapplsClassObject.Map({
        id: 'map',
        properties: {
          center: this.userLocation,
          zoomControl: true,
          location: true,
          geolocation: true,
          clickableIcons: true,
        },
      });
    });
  }

  nearbyLocations(){

    const loadObject = {
      map: true,
      plugins: ['nearby'],
    };

    this.mapplsClassObject.initialize(
      this.token,
      loadObject,
      () => {
        var options = {
          divId: 'nearby_search',
          keywords: this.userQuery,
          refLocation: this.userLocation,
          fitbounds: true,
          icon: {
            url: 'https://apis.mappls.com/map_v3/1.png',
          },
          click_callback: function (d: any) {
            if (d) {
              var l =
                'Name: ' +
                d.placeName +
                '\nAddress: ' +
                d.placeAddress +
                '\neLoc: ' +
                d.eLoc;
              alert(l);
            }
          },
        };
        this.mapplsPluginObject.nearby(options, (response: any) => {
                if (response && response.data) {
                    response.data.forEach((location: any) => {
                        this.addPinMarkerForNearBy(
                            location.eLoc,
                            location.placeName,
                            location.placeAddress,
                            location.keywords,
                            location.distance
                        );
                    });
                } else {
                    console.error('No data received from nearby API');
                }
            });
      }
    );
  }

  searchPlaceAndMark(loadObject: any): void {
    this.mapplsClassObject.initialize(this.token, loadObject, () => {
      const optional_config = {
        location: this.userLocation,
        region: 'IND',
        height: 300,
      };

      this.mapplsPluginObject.search(
        document.getElementById('auto'), // Assuming an input element with ID 'auto' exists
        optional_config,
        (data: any) => this.handleSearchResults(data)
      );
    });
  }

  handleSearchResults(data: any): void {
    if (data && Array.isArray(data)) {
      data.forEach((place) => {
        if (place.eLoc) {
          console.log("eLoc of searched place" + place.eLoc);
          this.addPinMarker(place.eLoc, place.placeName);
        }
      });
    }
  }

  addPinMarkerForNearBy(eLoc: string, placeName: string, placeAddress: string, keywords: string, distance: string): void {
    if (!this.mapObject) {
      console.error('Map is not initialized yet.');
      return;
    }

    try {
      // Create the pin marker on the map
      const marker = this.mapplsPluginObject.pinMarker({
        map: this.mapObject,
        pin: eLoc,
        popupHtml: `
            <div style="font-family: Arial, sans-serif; width: 250px;">
                <h3 style="color: green; margin: 0 0 10px;">${placeName}</h3>
                <p style="margin: 5px 0; font-size: 14px;">
                    <strong>Address:</strong> ${placeAddress}
                </p>
                <p style="margin: 5px 0; font-size: 14px;">
                    <strong>Distance:</strong> ${distance} meters
                </p>
                <p style="margin: 5px 0; font-size: 14px;">
                    <strong>Keywords:</strong> ${keywords}
                </p>
                <button style="
                    display: inline-block;
                    padding: 10px 15px;
                    font-size: 14px;
                    color: #fff;
                    background-color: #007bff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;"
                    onclick="window.getDirectionsHandler('${eLoc}')">
                    Get Directions
                </button>
            </div>
        `,
      });

      // var elocObj = this.mapplsPluginObject.getPinDetails(
      //   { pin: eLoc },
      //   (e: any) => {
      //     console.log(e);
      //   }
      // );

      // Ensure the popup is displayed when the marker is clicked
      // marker.on('click', () => {
      //   marker.openPopup();
      //   this.selectedELoc = eLoc;
      // });
    } catch (error) {
      console.error('Error adding pin marker:', error);
    }
  }

  addPinMarker(eLoc: string, placeName: string): void {
    if (!this.mapObject) {
      console.error('Map is not initialized yet.');
      return;
    }

    try {
      // Create the pin marker on the map
      const marker = this.mapplsPluginObject.pinMarker({
        map: this.mapObject,
        pin: eLoc,
        popupHtml: `
          <h3 style="color:green">${placeName}</h3>
          <button onclick="window.getDirectionsHandler('${eLoc}')">Get Directions</button>
        `,
      });

      // var elocObj = this.mapplsPluginObject.getPinDetails(
      //   { pin: eLoc },
      //   (e: any) => {
      //     console.log(e);
      //   }
      // );

      // Ensure the popup is displayed when the marker is clicked
      // marker.on('click', () => {
      //   marker.openPopup();
      //   this.selectedELoc = eLoc;
      // });
    } catch (error) {
      console.error('Error adding pin marker:', error);
    }
  }

  goBack(): void {
    // Implement your logic for going back to the previous state or closing the popup
    // This could involve closing the popup, resetting the map view, or other actions as needed
    console.log('Go Back button clicked');
    // Add your specific implementation here
  }

//   markLocation(locations: any[]): void {
//   if (!this.mapObject) {
//     console.error('Map is not initialized');
//     return;
//   }

//   // Remove the existing marker, if any
//   if (this.marker) {
//     this.marker.remove();
//   }

//   locations.forEach((location: any) => {
//     const { eLoc, placeName, placeAddress, alternateName } = location;

//     console.log('Adding marker for eLoc:', eLoc);

//     this.mapplsPluginObject.pinMarker(
//       {
//         map: this.mapObject,
//         pin: [eLoc],
//         popupHtml: `
//           <div style="color: black;">
//             <h2 style="color: green;">${placeName}</h2>
//             <p><strong>Address:</strong> ${placeAddress}</p>
//             <p><strong>Alternate Name:</strong> ${alternateName}</p>
//           </div>
//         `,
//       },
//       (markerEvent: any) => {
//         console.log('Marker event received:', markerEvent);

//         // Check if the event and target are valid
//         if (!markerEvent || !markerEvent.target) {
//           console.error('Marker event or target is undefined for eLoc:', eLoc);
//           return;
//         }

//         try {
//           markerEvent.target.on('click', () => {
//             console.log('Marker clicked:', eLoc);
//             this.selectedELoc = eLoc; // Save the selected eLoc if needed
//           });
//         } catch (error) {
//           console.error('Error adding click listener for eLoc:', eLoc, error);
//         }
//       }
//     );
//   });
// }

getDirections(destination: string): void {
  console.log("destination is: " + destination);

  localStorage.setItem('destination', destination);
  console.log('Destination saved to localStorage:', destination);
  // this.formattedLocation = `${this.userLocation[0].toFixed(3)},${this.userLocation[1].toFixed(3)}`;
  // localStorage.setItem('userLocation', this.formattedLocation);
  this.router.navigate(['/direction']);

  // if (!this.mapObject) {
  //   console.error('Map is not initialized');
  //   return;
  // }
  // const direction_option = {
  //   Resource: 'route_eta',
  //   annotations: 'nodes,congestion',
  //           map: this.mapObject,
  //   start: `${this.userLocation[0].toFixed(3)},${this.userLocation[1].toFixed(3)}`, // Ensure this is formatted as a string
  //   end: destination, // Pass a valid eLoc or lat,long
  //   steps: true, // Optional: To display detailed route steps
  // };
  // this.mapplsPluginObject.direction(direction_option, (response: any) => {
  //   if (response && response.paths) {
  //     console.log('Route rendered successfully:', response);
  //   } else {
  //     console.error('No route found or response is invalid:', response);
  //   }
  // });

}




// getUserCurrentLocation(): void {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         this.userLocation = [position.coords.latitude, position.coords.longitude];
//         if (this.mapObject) {
//           this.mapObject.setCenter(this.userLocation);
//         }
//       },
//       (error) => {
//         console.warn('Geolocation error:', error);
//       }
//     );
//   }
// }

ngOnDestroy() {
  delete (window as any).getDirectionsHandler;
}

}
