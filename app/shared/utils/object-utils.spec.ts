import { enumToArray, removeNil } from './object-utils';

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

  describe('enumToArray', () => {
    it('should return an array of numeric enums', () => {
      enum Test {
        Hello,
        World,
      }

      expect(enumToArray(Test)).toEqual(['Hello', 'World']);
    });

    it('should return an array of string enums', () => {
      enum Test {
        Hello = 'hello',
        World = 'world',
      }

      expect(enumToArray(Test)).toEqual(['hello', 'world']);
    });

    it('should return an array of heterogeneous enums', () => {
      enum Test {
        Hello,
        World = 'WORLD',
      }

      expect(enumToArray(Test)).toEqual(['Hello', 'WORLD']);
    });
  });
});
