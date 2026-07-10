import { Injectable } from '@angular/core';

export type Region = 'us' | 'co';

export interface RegionConfig {
  region: Region;
  locale: string;
  currency: string;
  timezone: string;
  apiBase: string;
}

const REGION_MAP: Record<string, Region> = {
  'mymasterbook.com':    'us',
  'co.mymasterbook.com': 'co',
  'localhost':           'us',
};

const REGION_CONFIG: Record<Region, RegionConfig> = {
  us: { region: 'us', locale: 'en-US', currency: 'USD', timezone: 'America/New_York', apiBase: 'https://apiprd2.mymasterbook.net' },
  co: { region: 'co', locale: 'es-CO', currency: 'COP', timezone: 'America/Bogota',   apiBase: 'https://apiprd2.mymasterbook.net' },
};

@Injectable({ providedIn: 'root' })
export class RegionService {
  private config: RegionConfig;

  constructor() {
    const hostname = window.location.hostname;

    // En desarrollo: ?region=co en la URL simula Colombia sin necesitar subdominios
    const urlRegion = new URLSearchParams(window.location.search).get('region') as Region;
    const devRegion = urlRegion && (['us', 'co'] as Region[]).includes(urlRegion) ? urlRegion : null;

    const region = devRegion ?? REGION_MAP[hostname] ?? 'us';
    this.config  = REGION_CONFIG[region];
  }

  getConfig():   RegionConfig { return this.config; }
  getRegion():   Region       { return this.config.region; }
  getLocale():   string       { return this.config.locale; }
  getCurrency(): string       { return this.config.currency; }
  getApiBase():  string       { return this.config.apiBase; }
}
