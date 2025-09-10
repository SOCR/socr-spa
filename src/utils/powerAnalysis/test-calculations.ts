/**
 * Power calculation functions for specific statistical tests
 */

import { nonCentralTCdf, normInv, nonCentralFCdf, fCritical, tCritical, normCdf } from './statistical-functions';

// Power calculation for one-sample t-test
export const powerOneSampleTTest = (
  sampleSize: number,
  effectSize: number,
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  if (sampleSize <= 0 || effectSize < 0 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  const df = sampleSize - 1;
  // Correct non-centrality parameter for one-sample t-test
  const ncp = effectSize * Math.sqrt(sampleSize);
  const tCrit = tCritical(alpha, df, tailType);
  
  let power;
  if (tailType === "two") {
    // Two-tailed test: P(|T| > t_crit) under H1
    const upperTail = 1 - nonCentralTCdf(tCrit, df, ncp);
    const lowerTail = nonCentralTCdf(-tCrit, df, ncp);
    power = upperTail + lowerTail;
  } else {
    // One-tailed test: P(T > t_crit) under H1
    power = 1 - nonCentralTCdf(tCrit, df, ncp);
  }
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for two-sample t-test (independent samples)
export const powerTwoSampleTTest = (
  sampleSize: number,  // Sample size per group
  effectSize: number,
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  if (sampleSize <= 1 || effectSize < 0 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  const df = 2 * sampleSize - 2;
  // Correct non-centrality parameter for two-sample t-test
  const ncp = effectSize * Math.sqrt(sampleSize / 2);
  const tCrit = tCritical(alpha, df, tailType);
  
  let power;
  if (tailType === "two") {
    // Two-tailed test: P(|T| > t_crit) under H1
    const upperTail = 1 - nonCentralTCdf(tCrit, df, ncp);
    const lowerTail = nonCentralTCdf(-tCrit, df, ncp);
    power = upperTail + lowerTail;
  } else {
    // One-tailed test: P(T > t_crit) under H1
    power = 1 - nonCentralTCdf(tCrit, df, ncp);
  }
  
  return Math.max(0.001, Math.min(0.999, power));
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

/**
 * One-way ANOVA power calculation (Cohen's f)
 * CORRECTED: Uses per-group sample size for ncp calculation
 */
export const powerOneWayANOVA = (sampleSize: number, effectSize: number, alpha: number, groups: number = 3): number => {
  if (sampleSize <= 1 || effectSize < 0 || alpha <= 0 || alpha >= 1 || groups < 2) {
    return 0;
  }

  // Standard interpretation: sampleSize is TOTAL sample size
  const totalN = sampleSize;
  const nPerGroup = totalN / groups;
  const df1 = groups - 1;
  const df2 = totalN - groups;
  
  // CORRECT ANOVA formula: ncp = n_per_group × f² (not total N)
  // This is the standard Cohen (1988) and statistical textbook formula
  const ncp = nPerGroup * effectSize * effectSize;
  const fCrit = fCritical(alpha, df1, df2);
  
  // Power = P(F > F_crit | H1) under non-central F
  const power = 1 - nonCentralFCdf(fCrit, df1, df2, ncp);
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for correlation test
export const powerCorrelation = (
  sampleSize: number,
  effectSize: number, // correlation coefficient r
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  if (sampleSize <= 2 || effectSize < 0 || effectSize >= 1 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  const df = sampleSize - 2;
  
  // Convert correlation to t-statistic under alternative hypothesis
  // t = r * sqrt((n-2)/(1-r^2))
  const tStat = effectSize * Math.sqrt(df / (1 - effectSize * effectSize));
  const tCrit = tCritical(alpha, df, tailType);
  
  let power;
  if (tailType === "two") {
    // Two-tailed test: P(|T| > t_crit) under H1
    const upperTail = 1 - nonCentralTCdf(tCrit, df, tStat);
    const lowerTail = nonCentralTCdf(-tCrit, df, tStat);
    power = upperTail + lowerTail;
  } else {
    // One-tailed test: P(T > t_crit) under H1
    power = 1 - nonCentralTCdf(tCrit, df, tStat);
  }
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for chi-square tests - CORRECTED formula
export const powerChiSquare = (
  sampleSize: number,
  effectSize: number, // Cohen's w
  alpha: number,
  df: number
): number => {
  if (sampleSize <= 0 || effectSize < 0 || alpha <= 0 || alpha >= 1 || df <= 0) {
    return 0;
  }

  // Non-centrality parameter for chi-square test
  const ncp = sampleSize * effectSize * effectSize;
  
  // Critical chi-square value using standard chi-square table approximation
  const criticalZ = normInv(1 - alpha);
  const criticalChi = df + Math.sqrt(2 * df) * criticalZ + (2/3) * criticalZ * criticalZ;
  
  // Power calculation using non-central chi-square distribution
  // Mean = df + ncp, Variance = 2*(df + 2*ncp)
  const mean = df + ncp;
  const variance = 2 * (df + 2 * ncp);
  
  if (variance <= 0) return 0.001;
  
  // Standardize and calculate power (probability of exceeding critical value)
  const z = (criticalChi - mean) / Math.sqrt(variance);
  const power = 1 - normCdf(z);
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for proportion test - Fixed formula
export const powerProportionTest = (
  sampleSize: number,
  effectSize: number, // Cohen's h
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  if (sampleSize <= 0 || effectSize < 0 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  // Critical z-value under null hypothesis
  const zAlpha = tailType === "two" 
    ? Math.abs(normInv(alpha / 2)) 
    : normInv(1 - alpha);
  
  // Standard error under alternative hypothesis 
  // For proportion test with Cohen's h: SE = 1/sqrt(n)
  const se = 1 / Math.sqrt(sampleSize);
  
  // Non-centrality parameter for proportion test
  const delta = effectSize / se;
  
  // Calculate power
  let power;
  if (tailType === "two") {
    // Two-tailed: P(|Z| > z_α/2 | H1)
    const upperPower = 1 - normCdf(zAlpha - delta);
    const lowerPower = normCdf(-zAlpha - delta);
    power = upperPower + lowerPower;
  } else {
    // One-tailed: P(Z > z_α | H1)
    power = 1 - normCdf(zAlpha - delta);
  }
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for linear regression
export const powerLinearRegression = (
  sampleSize: number,
  effectSize: number, // f²
  alpha: number,
  predictors: number = 1
): number => {
  if (sampleSize <= predictors + 1) return 0.001; // Invalid sample size
  
  // Degrees of freedom
  const df1 = predictors;
  const df2 = sampleSize - predictors - 1;
  
  // Non-centrality parameter
  const ncp = sampleSize * effectSize;
  
  // Critical F-value
  const criticalF = fCritical(alpha, df1, df2);
  
  // Calculate power - need to return 1 - nonCentralFCdf for correct power
  return 1 - nonCentralFCdf(criticalF, df1, df2, ncp);
};

/**
 * Multiple regression power calculation (Cohen's f²)
 * CORRECTED: Uses proper f² to ncp conversion for regression F-test
 */
export const powerMultipleRegression = (sampleSize: number, effectSize: number, alpha: number, predictors: number = 3): number => {
  if (sampleSize <= predictors + 1 || effectSize < 0 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  const df1 = predictors;
  const df2 = sampleSize - predictors - 1;
  
  // CORRECT: For Cohen's f², ncp = df2 * f² / (1 - R²)
  // Since f² = R²/(1-R²), we get: ncp = df2 * f²
  const ncp = df2 * effectSize;
  const fCrit = fCritical(alpha, df1, df2);
  
  // Power = P(F > F_crit | H1) under non-central F distribution
  const power = 1 - nonCentralFCdf(fCrit, df1, df2, ncp);
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for SEM (Structural Equation Modeling)
export const powerSEM = (
  sampleSize: number,
  effectSize: number, // RMSEA
  alpha: number,
  df: number = 10
): number => {
  if (sampleSize <= 0 || effectSize < 0 || alpha <= 0 || alpha >= 1 || df <= 0) {
    return 0;
  }

  // Calculate non-centrality parameter for SEM
  // For RMSEA test: ncp = (N-1) * df * RMSEA^2
  const ncp = (sampleSize - 1) * df * effectSize * effectSize;
  
  // Critical chi-square value
  const criticalZ = normInv(1 - alpha);
  const criticalChi = df + Math.sqrt(2 * df) * criticalZ + (2/3) * criticalZ * criticalZ;
  
  // Calculate power for non-central chi-square distribution
  // This tests H0: RMSEA = 0 vs H1: RMSEA = effectSize
  const mean = df + ncp;
  const variance = 2 * (df + 2 * ncp);
  
  if (variance <= 0) return 0.001;
  
  const z = (criticalChi - mean) / Math.sqrt(variance);
  const power = 1 - normCdf(z);
  
  return Math.max(0.001, Math.min(0.999, power));
};
