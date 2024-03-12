import { isSameLocation } from './location-utils';

describe('Location utils', () => {
  describe('isSameLocation', () => {
    it('should return true if locations are equal', () => {
      expect(
        isSameLocation([
          [123, 123],
          [123, 123],
        ]),
      ).toBeTruthy();
    });

    it('should return false if locations are not equal', () => {
      expect(
        isSameLocation([
          [123, 123],
          [456, 456],
        ]),
      ).toBeFalsy();
    });
  });
});
