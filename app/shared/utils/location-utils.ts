import { LatLong } from '@core/models/location';

/**
 * Compare two locations and return true if they are equal
 * @param locationA The first location to compare.
 * @param locationB The second location to compare.
 * @returns boolean
 */
export const isSameLocation = (locationA: LatLong, locationB: LatLong): boolean => {
  return locationA.toString() === locationB.toString();
};
