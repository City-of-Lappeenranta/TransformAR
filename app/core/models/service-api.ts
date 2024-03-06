/* eslint-disable @typescript-eslint/naming-convention */

export interface Service {
  code: string;
  name: string;
}

export type ServiceDictionary = Record<string, Record<string, Service[]>>;
