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

// Power calculation for one-way ANOVA
export const powerOneWayANOVA = (
  sampleSize: number, // Total sample size (not per group)
  effectSize: number, // Cohen's f
  alpha: number,
  groups: number = 3
): number => {
  if (sampleSize <= 1 || effectSize < 0 || alpha <= 0 || alpha >= 1 || groups < 2) {
    return 0;
  }

  // Sample size per group
  const nPerGroup = sampleSize / groups;
  const totalN = sampleSize;
  const df1 = groups - 1;
  const df2 = totalN - groups;
  
  // Correct non-centrality parameter for ANOVA (Cohen's f)
  // ncp = N * f^2 where N is total sample size
  const ncp = totalN * effectSize * effectSize;
  const fCrit = fCritical(alpha, df1, df2);
  
  // Power = P(F > F_crit | H1)
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

// Power calculation for chi-square tests
export const powerChiSquare = (
  sampleSize: number,
  effectSize: number, // Cohen's w
  alpha: number,
  df: number
): number => {
  if (sampleSize <= 0 || effectSize < 0 || alpha <= 0 || alpha >= 1 || df <= 0) {
    return 0;
  }

  // Non-centrality parameter
  const ncp = sampleSize * effectSize * effectSize;
  
  // Critical chi-square value using better approximation
  const criticalZ = normInv(1 - alpha);
  const criticalChi = df + Math.sqrt(2 * df) * criticalZ + (2/3) * criticalZ * criticalZ;
  
  // Calculate power using improved normal approximation
  // Mean of non-central chi-square = df + ncp
  // Variance of non-central chi-square = 2 * (df + 2 * ncp)
  const mean = df + ncp;
  const variance = 2 * (df + 2 * ncp);
  
  if (variance <= 0) return 0.001;
  
  const z = (criticalChi - mean) / Math.sqrt(variance);
  const power = 1 - normCdf(z);
  
  return Math.max(0.001, Math.min(0.999, power));
};

// Power calculation for proportion test
export const powerProportionTest = (
  sampleSize: number,
  effectSize: number, // Cohen's h
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  if (sampleSize <= 0 || effectSize < 0 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  // Critical z-value
  const criticalZ = tailType === "two"
    ? Math.abs(normInv(alpha / 2))
    : Math.abs(normInv(alpha));
  
  // Calculate power using correct formula for proportion test
  // Power = P(Z > z_crit - h*sqrt(n)) for one-tailed
  // Power = P(|Z| > z_crit - h*sqrt(n)) for two-tailed
  const sqrtN = Math.sqrt(sampleSize);
  const z = criticalZ - effectSize * sqrtN;
  
  let power;
  if (tailType === "two") {
    // Two-tailed test
    power = 2 * (1 - normCdf(z)) - 1;
    // Ensure power is positive
    power = Math.max(power, 1 - normCdf(Math.abs(z)));
  } else {
    // One-tailed test
    power = 1 - normCdf(z);
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

// Power calculation for multiple regression
export const powerMultipleRegression = (
  sampleSize: number,
  effectSize: number, // Cohen's f²
  alpha: number,
  predictors: number = 3
): number => {
  if (sampleSize <= predictors + 1 || effectSize < 0 || alpha <= 0 || alpha >= 1) {
    return 0;
  }

  const df1 = predictors;
  const df2 = sampleSize - predictors - 1;
  
  // Convert Cohen's f² to non-centrality parameter
  // For multiple regression: ncp = N * f²
  const ncp = sampleSize * effectSize;
  const fCrit = fCritical(alpha, df1, df2);
  
  // Power = P(F > F_crit | H1)
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
