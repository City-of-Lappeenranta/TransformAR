export type LatLong = [number, number];

export interface RadarSearchReponse {
  meta: {
    code: number;
  };
  addresses: [
    {
      latitude: number;
      longitude: number;
      geometry: {
        type: string;
        coordinates: [number, number];
      };
      country: string;
      countryCode: string;
      countryFlag: string;
      county: string;
      distance: number;
      borough: string;
      city: string;
      number: string;
      neighborhood: string;
      postalCode: string;
      stateCode: string;
      state: string;
      street: string;
      layer: string;
      formattedAddress: string;
      placeLabel: string;
    }
  ];
}
