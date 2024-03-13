import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import * as leaflet from 'leaflet';
import { LatLong } from '@core/models/location';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';
import { DataPointQuality } from '@core/models/data-point';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapService } from './map.service';
import { isSameLocation } from '@shared/utils/location-utils';
import { isEqual } from 'lodash';

export interface Marker {
  location: LatLong;
  quality?: DataPointQuality;
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
  @Input() public zoom = 13;
  @Input() public markers: Marker[] = [];

  @Output() public markerClick = new EventEmitter<LatLong>();

  public map: leaflet.Map | undefined;

  public constructor(
    private readonly http: HttpClient,
    private readonly mapService: MapService,
  ) {
    this.mapService.center$
      .pipe(takeUntilDestroyed())
      .subscribe((center: LatLong) => this.map?.setView(new leaflet.LatLng(...center), 15));
  }

  public ngOnInit(): void {
    this.initialiseMap();
  }

  public ngOnDestroy(): void {
    this.destroyMap();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers']) {
      const { previousValue, currentValue } = changes['markers'];
      this.renderMarkers(previousValue ?? [], currentValue);
    }
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

  private getMarkersToAdd(previousMarkers: Marker[], newMarkers: Marker[]): Marker[] {
    return newMarkers.filter(
      (marker) =>
        !previousMarkers.some(
          (prevMarker) => isSameLocation(marker.location, prevMarker.location) && marker.icon === prevMarker.icon,
        ),
    );
  }

  private getMarkersToRemove(previousMarkers: Marker[], newMarkers: Marker[]): Marker[] {
    return previousMarkers.filter(
      (prevMarker) =>
        !newMarkers.some(
          (marker) => isSameLocation(marker.location, prevMarker.location) && marker.icon === prevMarker.icon,
        ),
    );
  }

  private getMarkersToChange(previousMarkers: Marker[], newMarkers: Marker[]): Marker[] {
    return newMarkers.filter((prevMarker) => {
      const correspondingMarker = previousMarkers.find(
        (marker) => isSameLocation(marker.location, prevMarker.location) && marker.icon === prevMarker.icon,
      );
      return correspondingMarker && !isEqual(prevMarker, correspondingMarker);
    });
  }

  private renderMarkers(previousMarkers: Marker[], newMarkers: Marker[]): void {
    this.getMarkersToAdd(previousMarkers, newMarkers).forEach(this.renderMarker.bind(this));
    this.getMarkersToRemove(previousMarkers, newMarkers).forEach(this.removeMarkers.bind(this));
    this.getMarkersToChange(previousMarkers, newMarkers).forEach(this.updateMarkers.bind(this));
  }

  private onClickMarker(e: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.markerClick.emit([lat, lng]);
  }

  private removeMarkers(marker: Marker): void {
    this.map?.eachLayer((layer) => {
      if (layer instanceof leaflet.Marker) {
        const { lat, lng } = layer.getLatLng();

        const isMarkerToRemove = marker.icon
          ? layer.getElement()?.classList.contains(marker.icon?.replace('.svg', '')) &&
            isSameLocation(marker.location, [lat, lng])
          : isSameLocation(marker.location, [lat, lng]);

        if (isMarkerToRemove) {
          layer.remove();
        }
      }
    });
  }

  private updateMarkers(marker: Marker): void {
    this.map?.eachLayer((layer) => {
      if (layer instanceof leaflet.Marker) {
        const { lat, lng } = layer.getLatLng();
        const layerElement = layer.getElement();

        const isMarkerToUpdate = marker.icon
          ? layerElement?.classList.contains(marker.icon?.replace('.svg', '')) && isSameLocation(marker.location, [lat, lng])
          : isSameLocation(marker.location, [lat, lng]);

        if (isMarkerToUpdate) {
          const layerClassList = layerElement?.classList;
          layerClassList?.remove(...Object.values(DATA_POINT_QUALITY_CLASS_NAME), 'active');
          layerClassList?.add(marker.quality ? DATA_POINT_QUALITY_CLASS_NAME[marker.quality] : '');
          if (marker.active) {
            layerClassList?.add('active');
          }
        }
      }
    });
  }

  private async renderMarker(marker: Marker): Promise<void> {
    const { location, quality, active, icon } = marker;
    const markerSvg = await firstValueFrom(this.http.get('/assets/icons/marker.svg', { responseType: 'text' }));

    let iconSvg = '';
    if (icon) {
      iconSvg = await firstValueFrom(this.http.get(`/assets/icons/${icon}`, { responseType: 'text' }));
    }

    const svg = `   
        <div style="position: relative;">
          ${markerSvg}
          ${iconSvg}
        </div>
      `;

    let className = '';
    if (icon) {
      className += `${icon?.replace('.svg', '')} `;
    }
    className += quality ? `${DATA_POINT_QUALITY_CLASS_NAME[quality]} ` : 'default';

    if (active) {
      className += 'active';
    }

    this.map &&
      leaflet
        .marker(new leaflet.LatLng(...location), {
          icon: leaflet.divIcon({
            html: svg,
            className,
          }),
        })
        .on('click', this.onClickMarker.bind(this))
        .addTo(this.map);
  }
}

const DATA_POINT_QUALITY_CLASS_NAME: Record<DataPointQuality, string> = {
  [DataPointQuality.DEFAULT]: 'default',
  [DataPointQuality.GOOD]: 'good',
  [DataPointQuality.SATISFACTORY]: 'satisfactory',
  [DataPointQuality.FAIR]: 'fair',
  [DataPointQuality.POOR]: 'poor',
  [DataPointQuality.VERY_POOR]: 'very-poor',
  [DataPointQuality.NO_DATA_AVAILABLE]: 'no-data-available',
};
