
/**
 * Significance level calculation functions
 */

import { PowerParameters } from '@/types/power-analysis';
import { calculateScientificPower } from './index';

/**
 * Significance level calculation function based on test type
 */
export const calculateScientificSignificanceLevel = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.effectSize === null || params.power === null) {
    return null;
  }
  
  // This is more challenging to calculate analytically
  // We'll use a simplified approach focusing on common alpha levels
  
  const desiredPower = params.power;
  
  // Try common alpha levels and see which gives closest power
  const alphaLevels = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1];
  
  let bestAlpha = 0.05; // Default
  let minDiff = 1.0;
  
  // Find the alpha level that gives power closest to desired power
  for (const alpha of alphaLevels) {
    const paramsCopy = { ...params, significanceLevel: alpha };
    paramsCopy.power = null;
    const achievedPower = calculateScientificPower(paramsCopy);
    
    if (achievedPower !== null) {
      const diff = Math.abs(achievedPower - desiredPower);
      if (diff < minDiff) {
        minDiff = diff;
        bestAlpha = alpha;
      }
    }
  }
  
  return bestAlpha;
};
