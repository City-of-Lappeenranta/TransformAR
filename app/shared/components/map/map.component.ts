import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LatLong } from '@core/models/location';
import { environment } from '@environments/environment';
import { isSameLocation } from '@shared/utils/location-utils';
import * as leaflet from 'leaflet';
import { isEqual, cloneDeep } from 'lodash';
import { Observable, Subscription, firstValueFrom } from 'rxjs';

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
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy, DoCheck {
  @Input() public center$: Observable<LatLong> | null = null;
  @Input() public markers: Marker[] = [];

  @Output() public markerClick = new EventEmitter<LatLong>();
  @Output() public mapClick = new EventEmitter<LatLong>();

  public map: leaflet.Map | undefined;

  private mapInitialised = false;

  private readonly zoom = 13;
  private centerSubscription: Subscription | null = null;

  private differ: any;
  private previousMarkers: Marker[] = [];

  public constructor(
    private readonly http: HttpClient,
    private readonly differs: IterableDiffers,
  ) {
    this.differ = this.differs.find(this.markers).create(undefined);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialiseMap();
      this.renderMarkers();
    });
  }

  public ngDoCheck(): void {
    const changes = this.differ.diff(this.markers);

    if (changes && this.mapInitialised) {
      this.renderMarkers();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
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
      .on('click', this.onClickMap.bind(this))
      .setView(new leaflet.LatLng(...(environment.defaultLocation as LatLong)), this.zoom);

    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
      })
      .addTo(this.map);

    this.mapInitialised = true;
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
        const currentZoom = this.map?.getZoom() ?? this.zoom;
        const minimumZoom = 15;
        const zoom = currentZoom < minimumZoom ? minimumZoom : currentZoom;

        this.map?.setView(new leaflet.LatLng(...(center as LatLong)), zoom);
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

  private renderMarkers(): void {
    this.getMarkersToAdd(this.previousMarkers, this.markers).forEach(this.renderMarker.bind(this));
    this.getMarkersToRemove(this.previousMarkers, this.markers).forEach(this.removeMarker.bind(this));
    this.getMarkersToChange(this.previousMarkers, this.markers).forEach(this.updateMarker.bind(this));

    this.previousMarkers = cloneDeep(this.markers);
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

    const fillColor = color ?? '#275D38';
    const strokeColor = active ? '#275D38' : fillColor;
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

  private onClickMarker(e: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.markerClick.emit([lat, lng]);
  }

  private onClickMap(e: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.mapClick.emit([lat, lng]);
  }
}
