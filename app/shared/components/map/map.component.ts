import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DATA_POINT_QUALITY_COLOR_CHART, DataPointQuality } from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { environment } from '@environments/environment';
import * as leaflet from 'leaflet';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { isSameLocation } from '@shared/utils/location-utils';
import { isEqual } from 'lodash';

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
  @Input() public center$: Observable<LatLong> | null = null;
  @Input() public zoom = 13;
  @Input() public markers: Marker[] = [];

  @Output() public markerClick = new EventEmitter<LatLong>();

  public map: leaflet.Map | undefined;

  private centerSubscription: Subscription | null = null;

  public constructor(private readonly http: HttpClient) {}

  public ngOnInit(): void {
    this.initialiseMap();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers']) {
      const { previousValue, currentValue } = changes['markers'];
      this.renderMarkers(previousValue ?? [], currentValue);
    }

    if (changes['center$']) {
      this.subscribeToCenterObservable(changes['center$'].currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.centerSubscription?.unsubscribe();
    this.destroyMap();
  }

  private initialiseMap(): void {
    this.map = leaflet
      .map('map-host', {
        zoomControl: false,
        attributionControl: false,
      })
      .setView(new leaflet.LatLng(...(environment.defaultLocation as LatLong)), this.zoom);

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

  private subscribeToCenterObservable(center$: Observable<LatLong>): void {
    this.centerSubscription?.unsubscribe();
    // centerSubscription gets unsubscribed in ngOnDestroy
    this.centerSubscription =
      center$.subscribe((center) => {
        this.map?.setView(new leaflet.LatLng(...(center as LatLong)), 15);
      }) ?? null;
  }

  private getMarkersToAdd(previousMarkers: Marker[], newMarkers: Marker[]): Marker[] {
    return newMarkers.filter(
      (marker) => !previousMarkers.some((prevMarker) => isSameLocation(marker.location, prevMarker.location)),
    );
  }

  private getMarkersToRemove(previousMarkers: Marker[], newMarkers: Marker[]): Marker[] {
    return previousMarkers.filter(
      (prevMarker) => !newMarkers.some((marker) => isSameLocation(marker.location, prevMarker.location)),
    );
  }

  private getMarkersToChange(previousMarkers: Marker[], newMarkers: Marker[]): Marker[] {
    return newMarkers.filter((newMarker) => {
      const previousMarker = previousMarkers.find((marker) => isSameLocation(marker.location, newMarker.location));
      return previousMarker && !isEqual(newMarker, previousMarker);
    });
  }

  private renderMarkers(previousMarkers: Marker[], newMarkers: Marker[]): void {
    this.getMarkersToAdd(previousMarkers, newMarkers).forEach(this.renderMarker.bind(this));
    this.getMarkersToRemove(previousMarkers, newMarkers).forEach(this.removeMarker.bind(this));
    this.getMarkersToChange(previousMarkers, newMarkers).forEach(this.updateMarker.bind(this));
  }

  private onClickMarker(e: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.markerClick.emit([lat, lng]);
  }

  private removeMarker(marker: Marker): void {
    this.map?.eachLayer((layer) => {
      if (layer instanceof leaflet.Marker) {
        const { lat, lng } = layer.getLatLng();

        if (isSameLocation(marker.location, [lat, lng])) {
          layer.remove();
        }
      }
    });
  }

  private updateMarker(marker: Marker): void {
    this.map?.eachLayer(async (layer) => {
      if (layer instanceof leaflet.Marker) {
        const { lat, lng } = layer.getLatLng();

        if (isSameLocation(marker.location, [lat, lng])) {
          const divIcon = await this.getMarkerDivIcon(marker);
          layer.setIcon(divIcon);
        }
      }
    });
  }

  private async renderMarker(marker: Marker): Promise<void> {
    const { location } = marker;
    const divIcon = await this.getMarkerDivIcon(marker);

    this.map &&
      leaflet
        .marker(new leaflet.LatLng(...location), {
          icon: divIcon,
        })
        .on('click', this.onClickMarker.bind(this))
        .addTo(this.map);
  }

  private async getMarkerDivIcon(marker: Marker): Promise<leaflet.DivIcon> {
    const { color, active, icon } = marker;
    const markerSvg = await firstValueFrom(this.http.get('/assets/icons/marker.svg', { responseType: 'text' }));

    const fillColor = color ?? DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.DEFAULT];
    const strokeColor = active ? DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.DEFAULT] : fillColor;
    const styledMarkerSvg = markerSvg.replace('currentColor', fillColor).replace('strokeColor', strokeColor);

    let iconSvg = '';
    if (icon) {
      iconSvg = await firstValueFrom(this.http.get(`/assets/icons/${icon}`, { responseType: 'text' }));
    }

    const svg = `
        <div style="position: relative;">
          ${styledMarkerSvg}
          ${iconSvg}
        </div>
      `;

    return leaflet.divIcon({
      html: svg,
      ...this.getMarkerIconProperties(active),
    });
  }

  private getMarkerIconProperties(active: boolean | undefined): {
    iconAnchor: leaflet.PointExpression;
    iconSize: leaflet.PointExpression;
    className: string;
  } {
    const size = (active ? [44, 53] : [33, 40]) as leaflet.PointExpression;
    const anchor = (active ? [22, 53] : [16.5, 40]) as leaflet.PointExpression;
    const className = active ? 'active' : '';

    return { iconAnchor: anchor, iconSize: size, className };
  }
}
