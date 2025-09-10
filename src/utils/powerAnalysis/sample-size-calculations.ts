/**
 * Sample size calculation functions
 */

import { normInv, tCritical } from './statistical-functions';
import { PowerParameters } from '@/types/power-analysis';

/**
 * Sample size calculation function based on test type
 */
export const calculateScientificSampleSize = (params: PowerParameters): number | null => {
  if (params.effectSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  switch (params.test) {
    case "ttest-one-sample": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const d = params.effectSize;
      const power = params.power;
      const alpha = params.significanceLevel;
      
      // One-sample t-test sample size using proper t-distribution
      const zAlpha = normInv(1 - alpha / 2);
      const zBeta = normInv(power);
      
      // Cohen's formula for one-sample t-test
      const n = Math.pow((zAlpha + zBeta) / d, 2);
      
      return Math.max(4, Math.ceil(n));
    }

    case "ttest-two-sample": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const d = params.effectSize;
      const power = params.power;
      const alpha = params.significanceLevel;
      
      // Use Cohen's standard formula for two-sample t-test
      const zAlpha = normInv(1 - alpha / 2);
      const zBeta = normInv(power);
      
      // Two-sample t-test total sample size formula
      const nTotal = 2 * Math.pow((zAlpha + zBeta) / d, 2);
      
      return Math.max(4, Math.ceil(nTotal));
    }

    case "ttest-paired": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const d = params.effectSize;
      const power = params.power;
      const alpha = params.significanceLevel;
      const correlation = params.correlation || 0.5;
      
      const zAlpha = normInv(1 - alpha / 2);
      const zBeta = normInv(power);
      
      // Adjust for correlation in paired design
      const adjustedD = d / Math.sqrt(2 * (1 - correlation));
      const n = Math.pow((zAlpha + zBeta) / adjustedD, 2);
      
      return Math.max(4, Math.ceil(n));
    }

    case "anova": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const f = params.effectSize; // Cohen's f
      const groups = params.groups || 3;
      const alpha = params.significanceLevel;
      const power = params.power;
      
      // Use standard Cohen's formula for ANOVA sample size
      const zAlpha = normInv(1 - alpha);
      const zBeta = normInv(power);
      
      // Cohen's formula: n per group = (zα + zβ)² / f²
      const nPerGroup = Math.pow((zAlpha + zBeta) / f, 2);
      const totalN = Math.ceil(nPerGroup) * groups;
      
      return Math.max(groups * 4, totalN);
    }

    case "correlation": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const r = params.effectSize;
      const power = params.power;
      const alpha = params.significanceLevel;
      
      const zAlpha = normInv(1 - alpha / 2);
      const zBeta = normInv(power);
      
      // Fisher's z transformation
      const fisherZ = 0.5 * Math.log((1 + r) / (1 - r));
      const n = Math.pow((zAlpha + zBeta) / fisherZ, 2) + 3;
      
      return Math.max(4, Math.ceil(n));
    }

    case "chi-square-gof": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const w = params.effectSize; // Cohen's w
      const power = params.power;
      const alpha = params.significanceLevel;
      const groups = params.groups || 3;
      
      const zAlpha = normInv(1 - alpha);
      const zBeta = normInv(power);
      const df = groups - 1;
      
      const n = Math.pow(zAlpha + zBeta, 2) / (w * w);
      
      return Math.max(groups * 2, Math.ceil(n));
    }

    case "proportion-test": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const h = params.effectSize; // Cohen's h
      const power = params.power;
      const alpha = params.significanceLevel;
      
      const zAlpha = normInv(1 - alpha / 2);
      const zBeta = normInv(power);
      
      const n = Math.pow((zAlpha + zBeta) / h, 2);
      
      return Math.max(4, Math.ceil(n));
    }

    case "multiple-regression": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const f2 = params.effectSize; // f²
      const power = params.power;
      const alpha = params.significanceLevel;
      const predictors = params.predictors || 3;
      
      const zAlpha = normInv(1 - alpha);
      const zBeta = normInv(power);
      
      // Green's formula for multiple regression
      const n = predictors + 1 + Math.pow((zAlpha + zBeta), 2) / f2;
      
      return Math.max(predictors + 4, Math.ceil(n));
    }

    case "sem": {
      if (!params.effectSize || !params.power || !params.significanceLevel) return null;
      
      const rmsea = params.effectSize;
      const power = params.power;
      const alpha = params.significanceLevel;
      const df = params.degreesOfFreedom || 10;
      
      // MacCallum et al. (1996) formula for SEM sample size
      const zAlpha = normInv(1 - alpha);
      const zBeta = normInv(power);
      
      const ncp = df * rmsea * rmsea;
      const n = Math.pow(zAlpha + zBeta, 2) / ncp + 1;
      
      return Math.max(50, Math.ceil(n));
    }

    default:
      return null;
  }
};