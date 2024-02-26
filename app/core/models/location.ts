export type LatLong = [number, number];

export interface LocationSearchResult {
  street: string;
  number: string;
  city: string;
  country: string;
  latLong: LatLong;
}
