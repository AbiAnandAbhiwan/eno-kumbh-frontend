import { Component, OnInit } from '@angular/core';
import { mappls, mappls_plugin } from 'mappls-web-maps';

@Component({
  selector: 'app-nearby-search',
  standalone: true,
  imports: [],
  templateUrl: './nearby-search.component.html',
  styleUrl: './nearby-search.component.css'
})
export class NearbySearchComponent  implements OnInit{

  mapObject: any;
  mapplsClassObject = new mappls();
  mapplsPluginObject = new mappls_plugin();
  private token: string = '1fb63468-39d4-47e2-b6b8-80b9e07bdc55';

  mapProps = {
    center: [28.633, 77.2194],
    traffic: false,
    zoom: 4,
    geolocation: false,
    clickableIcons: false,
  };

  ngOnInit() {
    const loadObject = {
      map: false,
      plugins: ['nearby'],
    };

    this.mapplsClassObject.initialize(
      this.token,
      loadObject,
      () => {
        var options = {
          divId: 'nearby_search',
          keywords: 'atm',
          refLocation: '28.632735,77.219696',
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
        this.mapplsPluginObject.nearby(options, function (data: any) {
          let nr = data;
          console.log(nr);
        });
      }
    );
  }
}


