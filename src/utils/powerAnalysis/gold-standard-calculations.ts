/**
 * Gold standard power analysis calculations using robust numerical methods
 */

import { robustNormCdf, robustNormInv, robustTCdf, robustNonCentralTCdf, robustFCdf, robustNonCentralFCdf, robustChiSquareCdf } from './robust-numerical';
import { PowerParameters } from '@/types/power-analysis';

/**
 * Calculate F-critical value using robust methods
 */
const robustFCritical = (alpha: number, df1: number, df2: number): number => {
  // Binary search for F critical value
  let low = 0.001;
  let high = 100;
  let mid: number;
  
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const p = robustFCdf(mid, df1, df2);
    
    if (Math.abs(p - (1 - alpha)) < 1e-8) break;
    
    if (p < 1 - alpha) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
};

/**
 * Calculate t-critical value using robust methods
 */
const robustTCritical = (alpha: number, df: number, tails: number = 2): number => {
  const p = 1 - alpha / tails;
  
  // Binary search for t critical value
  let low = -10;
  let high = 10;
  let mid: number;
  
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const prob = robustTCdf(mid, df);
    
    if (Math.abs(prob - p) < 1e-8) break;
    
    if (prob < p) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
};

/**
 * Gold standard power calculations for each test type
 */
export const goldStandardPower = (params: PowerParameters): number | null => {
  const { test, sampleSize, effectSize, significanceLevel } = params;
  
  if (!sampleSize || !effectSize || !significanceLevel) return null;
  
  switch (test) {
    case "ttest-one-sample": {
      const d = effectSize;
      const n = sampleSize;
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      
      const df = n - 1;
      const ncp = d * Math.sqrt(n);
      const t_crit = robustTCritical(alpha, df, tails);
      
      if (tails === 1) {
        return 1 - robustNonCentralTCdf(t_crit, df, ncp);
      } else {
        const power_upper = 1 - robustNonCentralTCdf(t_crit, df, ncp);
        const power_lower = robustNonCentralTCdf(-t_crit, df, ncp);
        return power_upper + power_lower;
      }
    }

    case "ttest-two-sample": {
      const d = effectSize;
      const n_total = sampleSize;
      const n_per_group = n_total / 2;
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      
      const df = n_total - 2;
      const ncp = d * Math.sqrt(n_per_group / 2);
      const t_crit = robustTCritical(alpha, df, tails);
      
      if (tails === 1) {
        return 1 - robustNonCentralTCdf(t_crit, df, ncp);
      } else {
        const power_upper = 1 - robustNonCentralTCdf(t_crit, df, ncp);
        const power_lower = robustNonCentralTCdf(-t_crit, df, ncp);
        return power_upper + power_lower;
      }
    }

    case "ttest-paired": {
      const d = effectSize;
      const n = sampleSize;
      const alpha = significanceLevel;
      const correlation = params.correlation || 0.5;
      const tails = params.tailType === "one" ? 1 : 2;
      
      const df = n - 1;
      const d_adj = d / Math.sqrt(2 * (1 - correlation));
      const ncp = d_adj * Math.sqrt(n);
      const t_crit = robustTCritical(alpha, df, tails);
      
      if (tails === 1) {
        return 1 - robustNonCentralTCdf(t_crit, df, ncp);
      } else {
        const power_upper = 1 - robustNonCentralTCdf(t_crit, df, ncp);
        const power_lower = robustNonCentralTCdf(-t_crit, df, ncp);
        return power_upper + power_lower;
      }
    }

    case "anova": {
      const f = effectSize;  // Cohen's f
      const n_total = sampleSize;
      const groups = params.groups || 3;
      const alpha = significanceLevel;
      
      const n_per_group = n_total / groups;
      const df1 = groups - 1;
      const df2 = n_total - groups;
      
      // CORRECTED: Use total sample size * f² for ncp
      const ncp = n_total * f * f;
      const f_crit = robustFCritical(alpha, df1, df2);
      
      return 1 - robustNonCentralFCdf(f_crit, df1, df2, ncp);
    }

    case "correlation": {
      const r = effectSize;
      const n = sampleSize;
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      
      const df = n - 2;
      const t_stat = r * Math.sqrt((n - 2) / (1 - r * r));
      const t_crit = robustTCritical(alpha, df, tails);
      
      if (tails === 1) {
        return 1 - robustTCdf(t_crit - t_stat, df);
      } else {
        const power_upper = 1 - robustTCdf(t_crit - t_stat, df);
        const power_lower = robustTCdf(-t_crit - t_stat, df);
        return power_upper + power_lower;
      }
    }

    case "chi-square-gof": {
      const w = effectSize;  // Cohen's w
      const n = sampleSize;
      const alpha = significanceLevel;
      const groups = params.groups || 3;
      
      const df = groups - 1;
      const ncp = n * w * w;
      
      // Chi-square critical value - more accurate calculation
      let chi_crit = 0.001;
      let high = 100;
      
      // Binary search for chi-square critical
      for (let i = 0; i < 100; i++) {
        const mid = (chi_crit + high) / 2;
        const p = robustChiSquareCdf(mid, df);
        
        if (Math.abs(p - (1 - alpha)) < 1e-8) {
          chi_crit = mid;
          break;
        }
        
        if (p < 1 - alpha) {
          chi_crit = mid;
        } else {
          high = mid;
        }
      }
      
      // CORRECTED: Use proper non-central chi-square approximation
      // Power = P(X > chi_crit) where X ~ non-central chi-square(df, ncp)
      // Approximate using shifted central chi-square
      const shifted_stat = chi_crit - ncp;
      return shifted_stat <= 0 ? 1 : (1 - robustChiSquareCdf(shifted_stat, df + 2*Math.sqrt(2*ncp)));
    }

    case "proportion-test": {
      const h = effectSize;  // Cohen's h
      const n = sampleSize;
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      
      const z_alpha = robustNormInv(1 - alpha / tails);
      const z_beta = h * Math.sqrt(n / 4) - z_alpha;
      
      if (tails === 1) {
        return robustNormCdf(z_beta);
      } else {
        // CORRECTED: Proper two-tailed power calculation
        const power_upper = 1 - robustNormCdf(z_alpha - h * Math.sqrt(n / 4));
        const power_lower = robustNormCdf(-z_alpha - h * Math.sqrt(n / 4));
        return power_upper + power_lower;
      }
    }

    case "multiple-regression": {
      const f2 = effectSize;  // f²
      const n = sampleSize;
      const alpha = significanceLevel;
      const predictors = params.predictors || 3;
      
      const df1 = predictors;
      const df2 = n - predictors - 1;
      
      if (df2 <= 0) return 0;
      
      // CORRECTED: Use sample size * f² for ncp
      const ncp = n * f2;
      const f_crit = robustFCritical(alpha, df1, df2);
      
      return 1 - robustNonCentralFCdf(f_crit, df1, df2, ncp);
    }

    case "sem": {
      const rmsea = effectSize;
      const n = sampleSize;
      const alpha = significanceLevel;
      const df = params.degreesOfFreedom || 10;
      
      // MacCallum et al. (1996) approach
      const ncp = n * rmsea * rmsea;
      
      // Chi-square critical value
      let chi_crit = 0.001;
      let high = 100;
      
      for (let i = 0; i < 100; i++) {
        const mid = (chi_crit + high) / 2;
        const p = robustChiSquareCdf(mid, df);
        
        if (Math.abs(p - (1 - alpha)) < 1e-8) {
          chi_crit = mid;
          break;
        }
        
        if (p < 1 - alpha) {
          chi_crit = mid;
        } else {
          high = mid;
        }
      }
      
      return 1 - robustChiSquareCdf(chi_crit - ncp, df);
    }

    default:
      return null;
  }
};

/**
 * Gold standard sample size calculations using bisection method
 */
export const goldStandardSampleSize = (params: PowerParameters): number | null => {
  const { test, effectSize, significanceLevel, power } = params;
  
  if (!effectSize || !significanceLevel || !power) return null;
  
  // Use bisection method for stable convergence
  let low = 4;
  let high = 10000;
  let best_n = low;
  
  const tolerance = 0.005;
  const maxIterations = 100;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const mid = Math.round((low + high) / 2);
    const testParams = { ...params, sampleSize: mid };
    const calculatedPower = goldStandardPower(testParams) || 0;
    
    if (Math.abs(calculatedPower - power) < tolerance) {
      return mid;
    }
    
    if (calculatedPower < power) {
      low = mid;
      best_n = mid;
    } else {
      high = mid;
    }
    
    if (high - low <= 1) break;
  }
  
  return Math.max(4, best_n);
};

/**
 * Gold standard effect size calculations using bisection method
 */
export const goldStandardEffectSize = (params: PowerParameters): number | null => {
  const { test, sampleSize, significanceLevel, power } = params;
  
  if (!sampleSize || !significanceLevel || !power) return null;
  
  // Use bisection method for stable convergence
  let low = 0.01;
  let high = 3.0;
  let best_es = low;
  
  const tolerance = 0.005;
  const maxIterations = 100;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const mid = (low + high) / 2;
    const testParams = { ...params, effectSize: mid };
    const calculatedPower = goldStandardPower(testParams) || 0;
    
    if (Math.abs(calculatedPower - power) < tolerance) {
      return mid;
    }
    
    if (calculatedPower < power) {
      low = mid;
      best_es = mid;
    } else {
      high = mid;
    }
    
    if (high - low <= 0.001) break;
  }
  
  return Math.max(0.01, Math.min(3.0, best_es));
};