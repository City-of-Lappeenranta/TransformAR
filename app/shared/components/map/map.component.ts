import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
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
  @Input() center: LatLong = [0, 0];
  @Input() zoom = 13;
  @Input() markers: Marker[] = [];

  public map: L.Map | undefined;

  public ngOnInit(): void {
    this.initialiseMap();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      this.map?.setView(this.center);
    }

    if (changes['markers']) {
      this.map?.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      this.markers.forEach(
        ({ location }) =>
          this.map &&
          L.marker(new L.LatLng(...location), {
            icon: new L.Icon({
              iconUrl: '/assets/icons/marker.svg',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            }),
          }).addTo(this.map)
      );
    }
  }

  private initialiseMap() {
    this.map = L.map('map-host', {
      zoomControl: false,
      attributionControl: false,
    }).setView(new L.LatLng(...this.center), this.zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 20,
    }).addTo(this.map);
  }
}
