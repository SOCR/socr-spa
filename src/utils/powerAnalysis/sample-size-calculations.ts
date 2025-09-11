/**
 * Sample size calculation functions - GOLD STANDARD implementation
 */

import { goldStandardSampleSize } from './gold-standard-calculations';
import { PowerParameters } from '@/types/power-analysis';

/**
 * GOLD STANDARD: Sample size calculation using robust numerical methods
 */
export const calculateScientificSampleSize = (params: PowerParameters): number | null => {
  if (params.effectSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  return goldStandardSampleSize(params);
};