/* eslint-disable @typescript-eslint/naming-convention */

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
