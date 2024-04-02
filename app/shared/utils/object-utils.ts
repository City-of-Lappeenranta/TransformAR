import { isNil } from 'lodash';

/**
 * Removes all null or undefined values from the object
 * @param source Any object
 * @returns The source object without null or undefined
 */
export const removeNil = (source: Partial<Record<string, number | string | null>>): Record<string, number | string> => {
  const result: Record<string, number | string> = {};

  Object.entries(source).forEach(([key, value]) => {
    if (!isNil(value)) {
      result[key] = value;
    }
  });

  return result;
};
