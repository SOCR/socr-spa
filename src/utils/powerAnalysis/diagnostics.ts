/**
 * Diagnostics module for power analysis calculations
 * Provides detailed intermediate calculations for debugging test failures
 */

import { PowerParameters } from '@/types/power-analysis';
import { goldStandardPower } from './gold-standard-calculations';
import { robustNormCdf, robustNormInv, robustTCdf, robustFCdf, robustChiSquareCdf } from './robust-numerical';

export interface DiagnosticResults {
  testType: string;
  parameters: {
    sampleSize: number;
    effectSize: number;
    significanceLevel: number;
    [key: string]: any;
  };
  intermediates: {
    degreesOfFreedom?: {
      df?: number;
      df1?: number;
      df2?: number;
    };
    noncentralityParameter?: number;
    criticalValue?: number;
    testStatistic?: number;
    adjustedEffectSize?: number;
  };
  calculations: {
    currentMethod: number | null;
    referenceMethod: number | null;
    difference?: number;
    percentDifference?: number;
  };
  warnings: string[];
}

/**
 * Compute comprehensive diagnostics for a power analysis test case
 */
export const computeDiagnostics = (params: PowerParameters): DiagnosticResults => {
  const warnings: string[] = [];
  const diagnostics: DiagnosticResults = {
    testType: params.test,
    parameters: {
      sampleSize: params.sampleSize || 0,
      effectSize: params.effectSize || 0,
      significanceLevel: params.significanceLevel || 0.05,
      tailType: params.tailType,
      groups: params.groups,
      predictors: params.predictors,
      correlation: params.correlation,
      degreesOfFreedom: params.degreesOfFreedom
    },
    intermediates: {},
    calculations: {
      currentMethod: null,
      referenceMethod: null
    },
    warnings
  };

  if (!params.sampleSize || !params.effectSize || !params.significanceLevel) {
    warnings.push("Missing required parameters");
    return diagnostics;
  }

  const n = params.sampleSize;
  const effectSize = params.effectSize;
  const alpha = params.significanceLevel;

  // Calculate current method power
  const currentPower = goldStandardPower(params);
  diagnostics.calculations.currentMethod = currentPower;

  // Calculate reference method power and intermediates based on test type
  try {
    switch (params.test) {
      case "anova": {
        const f = effectSize; // Cohen's f
        const groups = params.groups || 3;
        const df1 = groups - 1;
        const df2 = n - groups;
        
        // CORRECTED: Use n * f² for ncp (not n_per_group)
        const ncp = n * f * f;
        const f_crit = calculateFCritical(alpha, df1, df2);
        
        diagnostics.intermediates = {
          degreesOfFreedom: { df1, df2 },
          noncentralityParameter: ncp,
          criticalValue: f_crit,
          adjustedEffectSize: f
        };
        
        // Reference calculation using proper non-central F
        const referencePower = 1 - robustNonCentralFCdfPoissonMixture(f_crit, df1, df2, ncp);
        diagnostics.calculations.referenceMethod = referencePower;
        
        if (df2 <= 0) warnings.push(`Invalid df2: ${df2}. Sample size too small for ${groups} groups.`);
        if (ncp < 0.01) warnings.push(`Very small non-centrality parameter: ${ncp.toFixed(4)}`);
        
        break;
      }

      case "multiple-regression": {
        const f2 = effectSize; // f²
        const predictors = params.predictors || 3;
        const df1 = predictors;
        const df2 = n - predictors - 1;
        
        if (df2 <= 0) {
          warnings.push(`Invalid df2: ${df2}. Need n > ${predictors + 1} for ${predictors} predictors.`);
          break;
        }
        
        // CORRECTED: Use (n - p - 1) * f² for ncp
        const ncp = df2 * f2;
        const f_crit = calculateFCritical(alpha, df1, df2);
        
        diagnostics.intermediates = {
          degreesOfFreedom: { df1, df2 },
          noncentralityParameter: ncp,
          criticalValue: f_crit,
          adjustedEffectSize: f2
        };
        
        // Reference calculation
        const referencePower = 1 - robustNonCentralFCdfPoissonMixture(f_crit, df1, df2, ncp);
        diagnostics.calculations.referenceMethod = referencePower;
        
        break;
      }

      case "chi-square-gof": {
        const w = effectSize; // Cohen's w
        const groups = params.groups || 3;
        const df = groups - 1;
        const ncp = n * w * w;
        const chi_crit = calculateChiSquareCritical(alpha, df);
        
        diagnostics.intermediates = {
          degreesOfFreedom: { df },
          noncentralityParameter: ncp,
          criticalValue: chi_crit,
          adjustedEffectSize: w
        };
        
        // Reference calculation using proper non-central chi-square
        const referencePower = 1 - robustNonCentralChiSquareCdfPoissonMixture(chi_crit, df, ncp);
        diagnostics.calculations.referenceMethod = referencePower;
        
        break;
      }

      case "proportion-test": {
        const h = effectSize; // Cohen's h
        const tails = params.tailType === "one" ? 1 : 2;
        
        // CORRECTED: Use proper Cohen's h formula
        const z_alpha = robustNormInv(1 - alpha / tails);
        const se = 1 / Math.sqrt(n); // Standard error for proportion test
        const z_stat = h / (2 * se); // Test statistic
        
        diagnostics.intermediates = {
          criticalValue: z_alpha,
          testStatistic: z_stat,
          adjustedEffectSize: h
        };
        
        // Reference calculation
        let referencePower: number;
        if (tails === 1) {
          referencePower = 1 - robustNormCdf(z_alpha - z_stat);
        } else {
          const powerUpper = 1 - robustNormCdf(z_alpha - z_stat);
          const powerLower = robustNormCdf(-z_alpha - z_stat);
          referencePower = powerUpper + powerLower;
        }
        
        diagnostics.calculations.referenceMethod = referencePower;
        
        if (h < 0.1) warnings.push(`Very small Cohen's h: ${h.toFixed(3)}`);
        
        break;
      }

      case "sem": {
        const rmsea = effectSize;
        const df = params.degreesOfFreedom || 10;
        
        // MacCallum et al. (1996) approach
        const ncp = (n - 1) * df * rmsea * rmsea;
        const chi_crit = calculateChiSquareCritical(alpha, df);
        
        diagnostics.intermediates = {
          degreesOfFreedom: { df },
          noncentralityParameter: ncp,
          criticalValue: chi_crit,
          adjustedEffectSize: rmsea
        };
        
        // Reference calculation
        const referencePower = 1 - robustNonCentralChiSquareCdfPoissonMixture(chi_crit, df, ncp);
        diagnostics.calculations.referenceMethod = referencePower;
        
        break;
      }

      default: {
        // For t-tests and correlation, current method should be accurate
        diagnostics.calculations.referenceMethod = currentPower;
        break;
      }
    }
  } catch (error) {
    warnings.push(`Error in reference calculation: ${error}`);
    diagnostics.calculations.referenceMethod = null;
  }

  // Calculate differences
  if (diagnostics.calculations.currentMethod !== null && diagnostics.calculations.referenceMethod !== null) {
    const diff = Math.abs(diagnostics.calculations.currentMethod - diagnostics.calculations.referenceMethod);
    diagnostics.calculations.difference = diff;
    diagnostics.calculations.percentDifference = diagnostics.calculations.referenceMethod > 0 
      ? (diff / diagnostics.calculations.referenceMethod) * 100 
      : 0;
  }

  return diagnostics;
};

/**
 * Helper function to calculate F critical value
 */
function calculateFCritical(alpha: number, df1: number, df2: number): number {
  let low = 0.001;
  let high = 100;
  
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const p = robustFCdf(mid, df1, df2);
    
    if (Math.abs(p - (1 - alpha)) < 1e-8) return mid;
    
    if (p < 1 - alpha) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
}

/**
 * Helper function to calculate Chi-square critical value
 */
function calculateChiSquareCritical(alpha: number, df: number): number {
  let low = 0.001;
  let high = 100;
  
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const p = robustChiSquareCdf(mid, df);
    
    if (Math.abs(p - (1 - alpha)) < 1e-8) return mid;
    
    if (p < 1 - alpha) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
}

/**
 * IMPROVED: Non-central F CDF using Poisson mixture method
 */
function robustNonCentralFCdfPoissonMixture(f: number, df1: number, df2: number, ncp: number): number {
  if (Math.abs(ncp) < 1e-10) {
    return robustFCdf(f, df1, df2);
  }
  
  if (f <= 0) return 0;
  
  let sum = 0;
  const maxTerms = 200;
  let lambda = ncp / 2;
  
  // Poisson mixture: sum over Poisson probabilities
  for (let j = 0; j < maxTerms; j++) {
    const poissonProb = Math.exp(-lambda + j * Math.log(lambda) - logFactorial(j));
    const centralF = robustFCdf(f, df1 + 2 * j, df2);
    sum += poissonProb * centralF;
    
    // Check for convergence
    if (j > 10 && poissonProb < 1e-12) break;
  }
  
  return Math.max(0, Math.min(1, sum));
}

/**
 * IMPROVED: Non-central Chi-square CDF using Poisson mixture method
 */
function robustNonCentralChiSquareCdfPoissonMixture(x: number, df: number, ncp: number): number {
  if (Math.abs(ncp) < 1e-10) {
    return robustChiSquareCdf(x, df);
  }
  
  if (x <= 0) return 0;
  
  let sum = 0;
  const maxTerms = 200;
  const lambda = ncp / 2;
  
  // Poisson mixture: sum over Poisson probabilities
  for (let j = 0; j < maxTerms; j++) {
    const poissonProb = Math.exp(-lambda + j * Math.log(lambda) - logFactorial(j));
    const centralChiSq = robustChiSquareCdf(x, df + 2 * j);
    sum += poissonProb * centralChiSq;
    
    // Check for convergence
    if (j > 10 && poissonProb < 1e-12) break;
  }
  
  return Math.max(0, Math.min(1, sum));
}

/**
 * Log factorial for numerical stability
 */
function logFactorial(n: number): number {
  if (n < 2) return 0;
  let result = 0;
  for (let i = 2; i <= n; i++) {
    result += Math.log(i);
  }
  return result;
}