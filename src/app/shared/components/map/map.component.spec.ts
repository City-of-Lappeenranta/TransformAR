import { Shallow } from 'shallow-render';
import { MapComponent, Marker } from './map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import * as leaflet from 'leaflet';
import { environment } from '../../../../environments/environment';
import { LatLong } from '../../../core/models/location';
import { DATA_POINT_QUALITY_COLOR_CHART, DataPointQuality } from '../../../core/models/data-point';
import { SimpleChange } from '@angular/core';

describe('MapComponent', () => {
  let shallow: Shallow<MapComponent>;

  beforeEach(() => {
    shallow = new Shallow(MapComponent)
      .mock(HttpClient, {
        get: () => of('<svg fill="currentColor" stroke="strokeColor"></svg>'),
      })
      .replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  describe('zoom', () => {
    it('should set zoom when input is not defined', async () => {
      const { instance } = await shallow.render();
      const defaultLocation = environment.defaultLocation;

      expect(instance.map?.getCenter()).toEqual({ lat: defaultLocation[0], lng: defaultLocation[1] });
      expect(instance.map?.getZoom()).toBe(13);
    });
  });

  describe('center', () => {
    it('should set initial center as the default environment value', async () => {
      const { instance } = await shallow.render();
      const defaultLocation = environment.defaultLocation;

      expect(instance.map?.getCenter()).toEqual({ lat: defaultLocation[0], lng: defaultLocation[1] });
    });

    it('should update the center when a new point is set in the map service', async () => {
      const center$ = new Subject<LatLong>();
      const { instance } = await shallow.render({ bind: { center$ } });

      center$.next([0, 2]);
      expect(instance.map?.getCenter()).toEqual({ lat: 0, lng: 2 });
    });
  });

  describe('should render markers', () => {
    it('when marker only has the location property', async () => {
      const markers: Marker[] = [{ location: [0, 0] }, { location: [1, 1] }];

      const { fixture, instance } = await shallow.render({ bind: { markers } });
      await fixture.whenStable();

      expect(instance.markers.length).toBe(markers.length);
    });

    it('when the marker input is updated it should shown the correct updated markers', async () => {
      const markers: Marker[] = [
        { location: [0, 0], active: false, color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.GOOD] },
        { location: [1, 1], active: false },
      ];
      const { find, fixture, instance } = await shallow.render({ bind: { markers } });

      await fixture.whenStable();

      expect(find('.leaflet-marker-icon').length).toBe(markers.length);

      const firstMarkerElement = find('.leaflet-marker-icon')[0].nativeElement as HTMLElement;
      const firstMarkerHTML = firstMarkerElement.innerHTML;
      const firstMarkerClassList = firstMarkerElement.classList;
      expect(getFillHexCode(firstMarkerHTML)).toBe(DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.GOOD]);
      expect(firstMarkerClassList.contains('active')).not.toBe(true);

      const secondMarkerElement = find('.leaflet-marker-icon')[1].nativeElement as HTMLElement;
      const secondMarkerHTML = secondMarkerElement.innerHTML;
      const secondMarkerClassList = secondMarkerElement.classList;
      expect(getFillHexCode(secondMarkerHTML)).toBe(DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.DEFAULT]);
      expect(secondMarkerClassList.contains('active')).not.toBe(true);

      const newMarkers: Marker[] = [
        { location: [0, 0], color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.POOR], active: true },
      ];
      instance.markers = newMarkers;
      instance.ngOnChanges({
        markers: new SimpleChange(markers, newMarkers, false),
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(find('.leaflet-marker-icon').length).toBe(newMarkers.length);

      const markerElement = find('.leaflet-marker-icon').nativeElement as HTMLElement;
      const markerHTML = markerElement.innerHTML;
      const markerClassList = markerElement.classList;
      expect(getFillHexCode(markerHTML)).toBe(DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.POOR]);
      expect(markerClassList.contains('active')).toBe(true);
    });
  });

  it('should emit markerClick event when a marker is clicked', async () => {
    const location = [0, 0] as [number, number];
    const markers: Marker[] = [{ location }];
    const { instance, fixture } = await shallow.render({ bind: { markers } });

    await fixture.whenStable();

    instance.map?.eachLayer((layer) => {
      if (layer instanceof leaflet.Marker) {
        layer.fire('click', {
          latlng: leaflet.latLng(location),
        });
      }
    });

    expect(instance.markerClick.emit).toHaveBeenCalledWith(location);
  });
});

function getFillHexCode(svgString: string): string | null {
  const fillMatch = RegExp(/fill="#([A-Fa-f0-9]{6})"/).exec(svgString);
  return fillMatch ? `#${fillMatch[1]}` : null;
}
