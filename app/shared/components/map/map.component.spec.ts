import { Shallow } from 'shallow-render';
import { MapComponent, Marker } from './map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import * as leaflet from 'leaflet';

describe('MapComponent', () => {
  let shallow: Shallow<MapComponent>;

  beforeEach(() => {
    shallow = new Shallow(MapComponent)
      .mock(HttpClient, {
        get: () =>
          of(
            '<svg width="100%" height="100%" viewBox="0 0 47 56" fill="none"xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.66663 23.1515C1.66663 11.1017 11.435 1.33334 23.4848 1.33334C35.5347 1.33334 45.303 11.1017 45.303 23.1515C45.303 30.713 41.0754 36.1587 36.7487 40.6653C35.7046 41.7527 34.6279 42.8116 33.5869 43.8354L33.4518 43.9683C32.3594 45.0427 31.3088 46.0789 30.3191 47.1219C28.3296 49.2185 26.7052 51.2224 25.6531 53.3266C25.2425 54.1479 24.403 54.6667 23.4848 54.6667C22.5666 54.6667 21.7271 54.1479 21.3165 53.3266C20.2644 51.2224 18.64 49.2185 16.6505 47.1219C15.6608 46.0789 14.6102 45.0427 13.5178 43.9683L13.3826 43.8353C12.3417 42.8116 11.265 41.7527 10.2209 40.6653C5.89418 36.1587 1.66663 30.713 1.66663 23.1515Z" fill="currentColor" stroke="strokeColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><svg>',
          ),
      })
      .replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  describe('should render markers', () => {
    it('when marker only has the location property', async () => {
      const markers: Marker[] = [{ location: [0, 0] }, { location: [1, 1] }];

      const { fixture, find } = await shallow.render({ bind: { markers, center: [0, 0] } });
      await fixture.whenStable();

      expect(leaflet.marker.length).toEqual(markers.length);
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
