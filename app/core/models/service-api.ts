/* eslint-disable @typescript-eslint/naming-convention */
import { LatLong } from './location';

export type ServiceListApiResponse = {
  service_code: string;
  service_name: string;
  description: string;
  metadata: boolean;
  type: string;
  keywords: string;
  group: string;
}[];

export interface Service {
  code: string;
  name: string;
}

export type ServiceDictionary = Record<string, Record<string, Service[]>>;

export interface PostServiceRequestProperties {
  serviceCode: string | null;
  description: string | null;
  files: File[];
  location: LatLong | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}
