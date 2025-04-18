import { getCountryCodeFromLanguageCode } from './i18n-utils';

describe('i18n utils', () => {
  describe('getBrowserLanguage', () => {
    it('should return the country code for different formats', () => {
      expect(getCountryCodeFromLanguageCode('fi-FI')).toBe('fi');
      expect(getCountryCodeFromLanguageCode('fi_FI')).toBe('fi');
      expect(getCountryCodeFromLanguageCode('fi')).toBe('fi');
    });
  });
});
