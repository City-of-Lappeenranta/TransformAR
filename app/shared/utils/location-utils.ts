import { LatLong } from '@core/models/location';

/**
 * Compare two locations and return true if they are equal
 * @param locations an array of two locations
 * @returns boolean
 */
export const isSameLocation = (locationA: LatLong, locationB: LatLong): boolean => {
  return locationA.toString() === locationB.toString();
};
