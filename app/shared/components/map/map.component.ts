import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as leaflet from 'leaflet';
import { LatLong } from '@core/models/location';

export interface Marker {
  location: LatLong;
  // icon, pop up...
}

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() public center: LatLong = [0, 0];
  @Input() public zoom = 13;
  @Input() public markers: Marker[] = [];

  public map: leaflet.Map | undefined;

  public ngOnInit(): void {
    this.initialiseMap();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      this.map?.setView(this.center);
    }

    if (changes['markers']) {
      this.map?.eachLayer((layer) => {
        if (layer instanceof leaflet.Marker) {
          layer.remove();
        }
      });

      this.markers.forEach(
        ({ location }) =>
          this.map &&
          leaflet
            .marker(new leaflet.LatLng(...location), {
              icon: new leaflet.Icon({
                iconUrl: '/assets/icons/marker.svg',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              }),
            })
            .addTo(this.map),
      );
    }
  }

  private initialiseMap(): void {
    this.map = leaflet
      .map('map-host', {
        zoomControl: false,
        attributionControl: false,
      })
      .setView(new leaflet.LatLng(...this.center), this.zoom);

    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
      })
      .addTo(this.map);
  }
}
