import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import * as leaflet from 'leaflet';
import { LatLong } from '@core/models/location';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';

export interface Marker {
  location: LatLong;
  color?: string;
  icon?: string;
  active?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public center: LatLong = environment.defaultLocation as LatLong;
  @Input() public zoom = 13;
  @Input() public markers: Marker[] = [];

  @Output() public markerClick = new EventEmitter<LatLong>();

  public map: leaflet.Map | undefined;

  public constructor(private http: HttpClient) {}

  public ngOnInit(): void {
    this.initialiseMap();
  }

  public ngOnDestroy(): void {
    this.destroyMap();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      this.map?.setView(this.center);
    }

    if (changes['markers']) {
      this.renderMarkers();
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

  private destroyMap(): void {
    this.map?.off();
    this.map?.remove();
  }

  private async renderMarkers(): Promise<void> {
    this.map?.eachLayer((layer) => {
      if (layer instanceof leaflet.Marker) {
        layer.remove();
      }
    });

    const markerSvg = await firstValueFrom(this.http.get('/assets/icons/marker.svg', { responseType: 'text' }));

    this.markers.forEach(async ({ location, color, active, icon }) => {
      const fillColor = color ?? '#275D38';
      const strokeColor = active ? '#275D38' : fillColor;
      const styledMarkerSvg = markerSvg.replace('currentColor', fillColor).replace('strokeColor', strokeColor);
      const size = (active ? [44, 53] : [33, 40]) as leaflet.PointExpression;
      const anchor = (active ? [22, 53] : [16.5, 40]) as leaflet.PointExpression;

      let iconSvg = '';

      if (icon) {
        iconSvg = (await firstValueFrom(this.http.get(`/assets/icons/${icon}`, { responseType: 'text' })))
          .replaceAll('currentColor', 'white')
          .replace(
            '<svg ',
            `<svg style="position: absolute; top: ${active ? '7' : '8'}px; left: 50%; transform: translateX(-50%); width: 100%;"`,
          )
          .replace(/width="(\d+)"/, `width="${active ? '28' : '18'}"`)
          .replace(/height="(\d+)"/, `height="${active ? '28' : '18'}"`);
      }

      const svg = `
        <div style="position: relative;">
          ${styledMarkerSvg}
          ${iconSvg}
        </div>
      `;

      this.map &&
        leaflet
          .marker(new leaflet.LatLng(...location), {
            icon: leaflet.divIcon({
              iconAnchor: anchor,
              iconSize: size,
              html: svg,
            }),
          })
          .on('click', this.onClickMarker.bind(this))
          .addTo(this.map);
    });
  }

  private onClickMarker(e: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.markerClick.emit([lat, lng]);
  }
}
