import { capitalize } from './string-utils';

describe('String utils', () => {
  describe('capitalize', () => {
    it('should only capitalize the first letter of the string', () => {
      expect(capitalize('hello WoRlD')).toBe('Hello WoRlD');
    });
  });
});
