/**
 * Fetch the browser language and return the country code
 * @returns string
 */
export const getCountryCodeFromLanguageCode = (language: string): string => {
  if (/-/.test(language)) {
    return language.split('-')[0];
  }

  if (/_/.test(language)) {
    return language.split('_')[0];
  }

  return language;
};
