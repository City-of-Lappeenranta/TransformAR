/**
 * Capitalize the first letter of a given string
 * @param string The string to be capitalized
 * @returns string
 */
export const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
