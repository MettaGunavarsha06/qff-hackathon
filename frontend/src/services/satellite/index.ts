/**
 * Satellite Layer Provider Abstraction
 * Manages authorized satellite imagery services (e.g. Esri World Imagery / Sentinel).
 */

import { MAP_LAYERS } from '../../config/mapProviders';
import type { TileLayerConfig } from '../../config/mapProviders';

export interface SatelliteProviderStatus {
  isAvailable: boolean;
  providerName: string;
  config?: TileLayerConfig;
  notice?: string;
}

export function getSatelliteProviderStatus(): SatelliteProviderStatus {
  const satelliteConfig = MAP_LAYERS.satellite;

  if (satelliteConfig && satelliteConfig.isConfigured) {
    return {
      isAvailable: true,
      providerName: satelliteConfig.name,
      config: satelliteConfig,
    };
  }

  return {
    isAvailable: false,
    providerName: 'None',
    notice: 'Satellite imagery provider not configured.',
  };
}
