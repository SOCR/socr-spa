/**
 * Gold standard power analysis calculations using robust numerical methods
 */

import { robustNormCdf, robustNormInv, robustTCdf, robustNonCentralTCdf, robustFCdf, robustNonCentralFCdf, robustChiSquareCdf, robustNonCentralChiSquareCdf, robustChiSquareCritical } from './robust-numerical';
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
      
      // IMPROVED: Use proper non-central chi-square CDF
      return 1 - robustNonCentralChiSquareCdf(chi_crit, df, ncp);
    }

    case "proportion-test": {
      const h = effectSize;  // Cohen's h  
      const n = sampleSize;  // Total sample size (n1 + n2 for two-sample)
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      
      // PHASE 2 FIX: Correct Cohen's h formula for two-sample proportion test
      // For two-sample test with equal groups: SE = sqrt(2/n_per_group) where n_per_group = n/2
      // Therefore: SE = sqrt(2/(n/2)) = sqrt(4/n) = 2/sqrt(n)
      // z_stat = h / SE = h * sqrt(n) / 2
      const z_alpha = robustNormInv(1 - alpha / tails);
      const z_stat = h * Math.sqrt(n) / 2; // Corrected: h * sqrt(n) / 2 for equal groups
      
      if (tails === 1) {
        return 1 - robustNormCdf(z_alpha - z_stat);
      } else {
        // Two-tailed test: power = Φ(z_stat - z_alpha)
        const z_beta = z_stat - z_alpha;
        return robustNormCdf(z_beta);
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
      
      // IMPROVED: Use (n - p - 1) * f² for non-centrality parameter
      const ncp = df2 * f2;
      const f_crit = robustFCritical(alpha, df1, df2);
      
      return 1 - robustNonCentralFCdf(f_crit, df1, df2, ncp);
    }

    case "sem": {
      const rmsea = effectSize;
      const n = sampleSize;
      const alpha = significanceLevel;
      const df = params.degreesOfFreedom || 10;
      const nullRmsea = params.nullRmsea || 0; // Default to exact fit test
      
      // PHASE 3 FIX: MacCallum et al. (1996) - correct close-fit test implementation
      const ncp_alt = (n - 1) * df * rmsea * rmsea;
      const ncp_null = (n - 1) * df * nullRmsea * nullRmsea;
      
      if (nullRmsea === 0) {
        // Exact fit test: H0: RMSEA = 0 (RIGHT-tailed)
        // Power = P(reject H0 | H1) = P(χ² > χ²_crit | NCP_alt)
        const chi_crit = robustChiSquareCritical(alpha, df); // Right tail
        return 1 - robustNonCentralChiSquareCdf(chi_crit, df, ncp_alt);
      } else {
        // Close fit test: H0: RMSEA ≥ nullRmsea vs H1: RMSEA < nullRmsea (LEFT-tailed)
        // Power = P(reject H0 | H1) = P(χ² < χ²_crit | NCP_alt)
        // Critical value for LEFT tail (we want to reject when χ² is too SMALL)
        // χ²_crit corresponds to P(χ² < χ²_crit | NCP_null) = alpha
        
        // For close-fit, use chi-square critical from non-central distribution under null
        // Binary search for critical value where P(χ² < crit | NCP_null) = alpha
        let low = 0.001;
        let high = 100;
        let chi_crit = low;
        
        for (let i = 0; i < 100; i++) {
          const mid = (low + high) / 2;
          const p = robustNonCentralChiSquareCdf(mid, df, ncp_null);
          
          if (Math.abs(p - alpha) < 1e-8) {
            chi_crit = mid;
            break;
          }
          
          if (p < alpha) {
            low = mid;
          } else {
            high = mid;
          }
        }
        
        // Power = P(χ² < χ²_crit | NCP_alt)
        return robustNonCentralChiSquareCdf(chi_crit, df, ncp_alt);
      }
    }

    case "mmrm": {
      const delta = effectSize;  // Standardized effect size (difference in means / SD)
      const n = sampleSize;       // Total sample size
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      const k = params.groups || 2;  // Number of groups
      const timePoints = params.timePoints || 4;
      const dropoutRate = params.dropoutRate || 0.05;
      const rho = params.withinCorrelation || 0.5;  // Within-subject correlation
      
      if (timePoints < 2 || n < k * timePoints) return null;
      
      // Calculate retention rates (linear dropout pattern)
      const retentionRates: number[] = [];
      for (let t = 0; t < timePoints; t++) {
        retentionRates.push(1 - (dropoutRate * t / (timePoints - 1)));
      }
      
      // Calculate average retention rate
      let sumRetention = 0;
      for (let t = 0; t < timePoints; t++) {
        sumRetention += retentionRates[t];
      }
      const avgRetention = sumRetention / timePoints;
      
      // Simplified variance inflation factor (Lu, Luo, & Chen 2008 approximation)
      // Accounts for correlation structure and dropout pattern
      // phi ≈ (1 - rho * avgRetention) / avgRetention
      const phi = (1 - rho * avgRetention) / avgRetention;
      
      // Adjust for number of groups
      const n_per_group = n / k;
      
      // Calculate non-centrality parameter
      // For group × time interaction at final time point
      const ncp = delta * Math.sqrt(n_per_group / (2 * phi));
      
      // Use z-test approximation for large samples (standard in MMRM)
      const z_alpha = robustNormInv(1 - alpha / tails);
      
      if (tails === 1) {
        return 1 - robustNormCdf(z_alpha - ncp);
      } else {
        const z_beta = ncp - z_alpha;
        return robustNormCdf(z_beta);
      }
    }

    case "logistic-regression": {
      // Hsieh, Bloch, and Larsen (1998) method for logistic regression power
      const logOR = effectSize;  // Effect size is log(OR)
      const n = sampleSize;
      const alpha = significanceLevel;
      const tails = params.tailType === "one" ? 1 : 2;
      
      // Get baseline probability
      const P0 = params.baselineProb || 0.25;
      
      // Calculate odds at baseline
      const odds0 = P0 / (1 - P0);
      
      // Calculate probability in exposed group
      const OR = Math.exp(logOR);
      const odds1 = odds0 * OR;
      const P1 = odds1 / (1 + odds1);
      
      // Calculate average probability and variance component based on predictor type
      let PA: number;
      let varianceAdjustment: number;
      
      if (params.predictorType === "binary") {
        // Binary predictor: weighted average based on predictor proportion
        const p1 = params.predictorProportion || 0.5;
        const p0 = 1 - p1;
        PA = p0 * P0 + p1 * P1;
        
        // Variance for binary predictor: p₁ * p₀
        varianceAdjustment = p1 * p0;
      } else {
        // Continuous predictor (standardized σ²ₓ = 1 by default)
        const sigmaX2 = params.predictorVariance || 1.0;
        PA = (P0 + P1) / 2;  // Use average probability
        
        // Variance for continuous predictor: σ²ₓ
        varianceAdjustment = sigmaX2;
      }
      
      // Calculate non-centrality parameter based on Hsieh formula
      // ncp = |log(OR)| * sqrt(n * PA * (1-PA) * varianceAdjustment)
      const ncp = Math.abs(logOR) * Math.sqrt(n * PA * (1 - PA) * varianceAdjustment);
      
      // Z-test approximation for Wald test
      const z_alpha = robustNormInv(1 - alpha / tails);
      
      if (tails === 1) {
        return 1 - robustNormCdf(z_alpha - ncp);
      } else {
        // Two-tailed: power = Φ(ncp - z_alpha) + Φ(-ncp - z_alpha)
        const power_upper = 1 - robustNormCdf(z_alpha - ncp);
        const power_lower = robustNormCdf(-z_alpha - ncp);
        return power_upper + power_lower;
      }
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