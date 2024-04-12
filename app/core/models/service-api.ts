/* eslint-disable @typescript-eslint/naming-convention */
import { LatLong } from './location';

export interface Service {
  code: string;
  name: string;
}

export type ServiceDictionary = Record<string, Record<string, Service[]>>;

export interface PostServiceRequestProperties {
  serviceCode: string | null;
  message: string | null;
  files: File[];
  location: LatLong | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}
