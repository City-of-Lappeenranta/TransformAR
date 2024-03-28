import { removeNil } from './object-utils';

describe('Object utils', () => {
  describe('removeNil', () => {
    it('should return an object without nil values', () => {
      const source = {
        a: null,
        b: undefined,
        c: 'string',
        d: '',
        e: 0,
        f: 1,
      };

      const result = {
        c: 'string',
        d: '',
        e: 0,
        f: 1,
      };

      expect(removeNil(source)).toEqual(result);
    });
  });
});
