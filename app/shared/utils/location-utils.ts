import { LatLong } from '@core/models/location';

/**
 * Compare two locations and return true if they are equal
 * @param locations an array of two locations
 * @returns boolean
 */
export const isSameLocation = (locations: [LatLong, LatLong]): boolean => {
  return locations[0].toString() === locations[1].toString();
};
