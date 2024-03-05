import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as leaflet from 'leaflet';
import { LatLong } from '@core/models/location';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export interface Marker {
  location: LatLong;
  color?: string;
  // icon, pop up...
}

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() public center: LatLong = environment.defaultLocation as LatLong;
  @Input() public zoom = 13;
  @Input() public markers: Marker[] = [];

  @Output() public markerClick = new EventEmitter<LatLong>();

  public map: leaflet.Map | undefined;

  public constructor(private http: HttpClient) {}

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

      this.http.get('/assets/icons/marker.svg', { responseType: 'text' }).subscribe((svg) => {
        this.markers.forEach(
          ({ location, color }) =>
            this.map &&
            leaflet
              .marker(new leaflet.LatLng(...location), {
                icon: leaflet.divIcon({
                  html: svg.replace('currentColor', color ?? '#275D38'),
                }),
              })
              .on('click', this.onClickMarker.bind(this))
              .addTo(this.map),
        );
      });
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

  private onClickMarker(e: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    console.log('yo');
    this.markerClick.emit([lat, lng]);
  }
}
