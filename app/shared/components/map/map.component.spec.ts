import { Shallow } from 'shallow-render';
import { MapComponent, Marker } from './map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import * as leaflet from 'leaflet';
import { SimpleChange } from '@angular/core';
import { environment } from '@environments/environment';
import { LatLong } from '@core/models/location';

describe('MapComponent', () => {
  let shallow: Shallow<MapComponent>;

  beforeEach(() => {
    shallow = new Shallow(MapComponent)
      .mock(HttpClient, {
        get: () => of('<svg></svg>'),
      })
      .replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  describe('center and zoom', () => {
    it('should set default center and zoom when input is not defined', async () => {
      const { instance, fixture } = await shallow.render();
      const defaultLocation = environment.defaultLocation;

      expect(instance.map?.getCenter()).toEqual({ lat: defaultLocation[0], lng: defaultLocation[1] });
      expect(instance.map?.getZoom()).toEqual(13);

      const newLocation = [1, 2] as LatLong;
      instance.center = newLocation;
      instance.ngOnChanges({
        center: new SimpleChange(environment.defaultLocation, instance.center, false),
      });

      await fixture.whenStable();

      expect(instance.map?.getCenter()).toEqual({ lat: newLocation[0], lng: newLocation[1] });
    });

    it('should set center and zoom from input', async () => {
      const location = [1, 1] as LatLong;
      const zoom = 2;

      const { instance } = await shallow.render({ bind: { center: location, zoom } });

      expect(instance.map?.getCenter()).toEqual({ lat: location[0], lng: location[1] });
      expect(instance.map?.getZoom()).toEqual(zoom);
    });
  });

  describe('should render markers', () => {
    it('when marker only has the location property', async () => {
      const markers: Marker[] = [{ location: [0, 0] }, { location: [1, 1] }];

      const { fixture, instance } = await shallow.render({ bind: { markers, center: [0, 0] } });
      await fixture.whenStable();

      expect(instance.markers.length).toEqual(markers.length);
    });

    it('when the marker input is updated it should shown the correct updated markers', async () => {
      const markers: Marker[] = [
        { location: [0, 0], active: false },
        { location: [1, 1], active: false },
      ];

      const { fixture, instance } = await shallow.render({ bind: { markers, center: [0, 0] } });

      await fixture.whenStable();

      expect(instance.markers.length).toEqual(markers.length);

      const newMarkers: Marker[] = [{ location: [0, 0], active: true }];
      instance.markers = newMarkers;
      instance.ngOnChanges({
        markers: new SimpleChange(markers, newMarkers, false),
      });

      await fixture.whenStable();

      expect(instance.markers.length).not.toEqual(markers.length);
      expect(instance.markers.length).toEqual(newMarkers.length);
    });
  });

  it('should emit markerClick event when a marker is clicked', async () => {
    const location = [0, 0] as [number, number];
    const markers: Marker[] = [{ location }];
    const { instance, fixture } = await shallow.render({ bind: { markers, center: [0, 0] } });

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
