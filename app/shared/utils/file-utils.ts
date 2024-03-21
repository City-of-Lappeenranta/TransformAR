/**
 * Convert a value in bytes to megabytes
 * @param value The value in bytes.
 * @returns The value in megabytes
 */
export const convertBytesToMegabytes = (value: number): number => {
  return value / 1024 / 1024;
};

/**
 * Convert a value in megabytes to bytes
 * @param value The value in megabytes.
 * @returns The value in bytes
 */
export const convertMegabytesToBytes = (value: number): number => {
  return value * 1024 * 1024;
};
