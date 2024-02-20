import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { LatLong } from '../../../core/models/location';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() center: LatLong = [0, 0];
  @Input() zoom = 13;

  public map: L.Map | undefined;

  public ngOnInit(): void {
    this.initialiseMap();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      this.map?.setView(changes['center'].currentValue);
    }
  }

  private initialiseMap() {
    this.map = L.map('map-host').setView(
      new L.LatLng(...this.center),
      this.zoom
    );

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);
  }
}
