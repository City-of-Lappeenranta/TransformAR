import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../../environment/environment';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() initialLocation: L.LatLng = new L.LatLng(
    ...(environment.defaultLocation as [number, number])
  );
  @Input() initialZoom = 13;

  public map: L.Map | undefined;

  public ngOnInit(): void {
    this.initialiseMap();
  }

  private initialiseMap() {
    this.map = L.map('map-host').setView(
      this.initialLocation,
      this.initialZoom
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
