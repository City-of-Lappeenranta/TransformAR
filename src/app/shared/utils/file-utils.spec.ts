import { convertBytesToMegabytes, convertMegabytesToBytes } from './file-utils';

describe('File utils', () => {
  describe('convertBytesToMegabytes', () => {
    it('should return the value as megabytes', () => {
      expect(convertBytesToMegabytes(8388608)).toBe(8);
    });
  });

  describe('convertMegabytesToBytes', () => {
    it('should return the value as bytes', () => {
      expect(convertMegabytesToBytes(8)).toBe(8388608);
    });
  });
});
