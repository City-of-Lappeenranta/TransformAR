import { isNil } from 'lodash';

export const removeNil = (source: Partial<Record<string, number | string | null>>): Record<string, number | string> => {
  const result: Record<string, number | string> = {};

  Object.entries(source).forEach(([key, value]) => {
    if (!isNil(value)) {
      result[key] = value;
    }
  });

  return result;
};
