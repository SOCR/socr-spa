
/**
 * Effect size calculation functions - GOLD STANDARD implementation
 */

import { goldStandardEffectSize } from './gold-standard-calculations';
import { PowerParameters } from '@/types/power-analysis';

/**
 * GOLD STANDARD: Effect size calculation using robust numerical methods
 */
export const calculateScientificEffectSize = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  return goldStandardEffectSize(params);
};
