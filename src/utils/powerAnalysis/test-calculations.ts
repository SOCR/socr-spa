/**
 * Power calculation functions for specific statistical tests
 */

import { nonCentralTCdf, normInv, nonCentralFCdf, fCritical, normCdf } from './statistical-functions';

// Power calculation for one-sample t-test
export const powerOneSampleTTest = (
  sampleSize: number,
  effectSize: number,
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  const df = sampleSize - 1;
  const ncp = effectSize * Math.sqrt(sampleSize); // Non-centrality parameter
  const criticalT = tailType === "two"
    ? Math.abs(normInv(alpha / 2)) // Two-tailed test
    : Math.abs(normInv(alpha));     // One-tailed test
  
  // Calculate power using non-central t-distribution
  if (tailType === "two") {
    // Two-tailed test
    return 1 - (nonCentralTCdf(criticalT, df, ncp) - nonCentralTCdf(-criticalT, df, ncp));
  } else {
    // One-tailed test
    return 1 - nonCentralTCdf(criticalT, df, ncp);
  }
};

// Power calculation for two-sample t-test (independent samples)
export const powerTwoSampleTTest = (
  sampleSize: number,  // Total sample size across both groups
  effectSize: number,
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  const n1 = Math.floor(sampleSize / 2); // Sample size in group 1
  const n2 = sampleSize - n1;            // Sample size in group 2
  
  // Calculate degrees of freedom (approximation for unequal sample sizes)
  const df = n1 + n2 - 2;
  
  // Calculate non-centrality parameter
  const ncp = effectSize * Math.sqrt((n1 * n2) / (n1 + n2)); 
  
  // Critical value for the test
  const criticalT = tailType === "two"
    ? Math.abs(normInv(alpha / 2)) // Two-tailed test
    : Math.abs(normInv(alpha));     // One-tailed test
  
  // Calculate power
  if (tailType === "two") {
    return 1 - (nonCentralTCdf(criticalT, df, ncp) - nonCentralTCdf(-criticalT, df, ncp));
  } else {
    return 1 - nonCentralTCdf(criticalT, df, ncp);
  }
};

// Power calculation for paired t-test
export const powerPairedTTest = (
  sampleSize: number,
  effectSize: number,
  alpha: number,
  correlation: number = 0.5,
  tailType: "one" | "two" = "two"
): number => {
  // Adjust effect size for correlation between pairs
  const adjustedEffectSize = effectSize / Math.sqrt(2 * (1 - correlation));
  
  // Use one-sample t-test power calculation with adjusted effect size
  return powerOneSampleTTest(sampleSize, adjustedEffectSize, alpha, tailType);
};

// Power calculation for one-way ANOVA
export const powerOneWayANOVA = (
  sampleSize: number, // Total sample size
  effectSize: number, // Cohen's f
  alpha: number,
  groups: number = 3
): number => {
  // Adjust for sample size per group
  const n = Math.floor(sampleSize / groups);
  
  // Degrees of freedom
  const df1 = groups - 1;
  const df2 = sampleSize - groups;
  
  // Non-centrality parameter
  const ncp = n * groups * effectSize * effectSize;
  
  // Critical F-value
  const criticalF = fCritical(alpha, df1, df2);
  
  // Calculate power
  return nonCentralFCdf(criticalF, df1, df2, ncp);
};

// Power calculation for correlation test
export const powerCorrelation = (
  sampleSize: number,
  effectSize: number, // correlation coefficient r
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  // Fisher's Z transformation of correlation coefficient
  const fisherZ = 0.5 * Math.log((1 + effectSize) / (1 - effectSize));
  
  // Standard error of Fisher's Z
  const se = 1 / Math.sqrt(sampleSize - 3);
  
  // Critical z-value
  const criticalZ = tailType === "two"
    ? Math.abs(normInv(alpha / 2))
    : Math.abs(normInv(alpha));
  
  // Calculate power
  const criticalValue = criticalZ * se;
  const powerValue = normCdf((Math.abs(fisherZ) - criticalValue) / se);
  
  return tailType === "two" ? powerValue : Math.max(0.5, powerValue);
};

// Power calculation for chi-square tests
export const powerChiSquare = (
  sampleSize: number,
  effectSize: number, // Cohen's w
  alpha: number,
  df: number
): number => {
  // Non-centrality parameter
  const ncp = sampleSize * effectSize * effectSize;
  
  // Critical chi-square value (approximation)
  const criticalChi = df * (1 + 2 / (9 * df) - 2 / (9 * df) * Math.pow(normInv(1 - alpha), 3/2));
  
  // Calculate power (approximation)
  const delta = ncp / df;
  const powerValue = 1 - normCdf(
    (Math.sqrt(2 * criticalChi) - Math.sqrt(2 * df - 1 + delta)) / 
    Math.sqrt(1 + delta / df)
  );
  
  return Math.max(0.001, Math.min(0.999, powerValue));
};

// Power calculation for proportion test
export const powerProportionTest = (
  sampleSize: number,
  effectSize: number, // h = 2*arcsin(sqrt(p1)) - 2*arcsin(sqrt(p0))
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  // Critical z-value
  const criticalZ = tailType === "two"
    ? Math.abs(normInv(alpha / 2))
    : Math.abs(normInv(alpha));
  
  // Calculate power
  const sqrtN = Math.sqrt(sampleSize);
  const powerValue = 1 - normCdf(criticalZ - effectSize * sqrtN);
  
  return Math.max(0.001, Math.min(0.999, tailType === "one" ? powerValue : 2 * powerValue - 1));
};

// Power calculation for linear regression
export const powerLinearRegression = (
  sampleSize: number,
  effectSize: number, // f²
  alpha: number,
  predictors: number = 1
): number => {
  // Degrees of freedom
  const df1 = predictors;
  const df2 = sampleSize - predictors - 1;
  
  // Non-centrality parameter
  const ncp = sampleSize * effectSize;
  
  // Critical F-value
  const criticalF = fCritical(alpha, df1, df2);
  
  // Calculate power
  return nonCentralFCdf(criticalF, df1, df2, ncp);
};

// Power calculation for multiple regression
export const powerMultipleRegression = (
  sampleSize: number,
  effectSize: number, // f²
  alpha: number,
  predictors: number = 3
): number => {
  // Use the linear regression function with multiple predictors
  return powerLinearRegression(sampleSize, effectSize, alpha, predictors);
};

// Power calculation for SEM (Structural Equation Modeling)
export const powerSEM = (
  sampleSize: number,
  effectSize: number, // Using RMSEA as effect size
  alpha: number,
  df: number = 10
): number => {
  // Calculate non-centrality parameter lambda based on effect size (RMSEA), sample size, and df
  // Lambda = (N-1) * df * effectSize^2
  const ncp = (sampleSize - 1) * df * Math.pow(effectSize, 2);
  
  // Critical chi-square value for alpha level and df
  const criticalChi = df * (1 + 2 / (9 * df) - 2 / (9 * df) * Math.pow(normInv(1 - alpha), 1.5));
  
  // Calculate power (probability of rejecting H0 when H1 is true)
  // Using chi-square distribution with df degrees of freedom and ncp as non-centrality parameter
  // This is an approximation of the power for SEM
  const powerValue = 1 - normCdf(
    (Math.sqrt(2 * criticalChi) - Math.sqrt(2 * df - 1 + ncp / df)) / 
    Math.sqrt(1 + ncp / (2 * df))
  );
  
  return Math.max(0.001, Math.min(0.999, powerValue));
};
