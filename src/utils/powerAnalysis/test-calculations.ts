/**
 * Power calculation functions - GOLD STANDARD implementation
 */

import { goldStandardPower } from './gold-standard-calculations';
import { PowerParameters } from '@/types/power-analysis';

/**
 * GOLD STANDARD: Main power calculation function using robust numerical methods
 */
export const calculateScientificPower = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.effectSize === null || params.significanceLevel === null) {
    return null;
  }
  
  // Use gold standard calculations for accuracy
  return goldStandardPower(params);
};

// Legacy functions retained for backward compatibility but now use gold standard

import { normInv, tCritical, fCritical, nonCentralFCdf, nonCentralTCdf, normCdf } from './statistical-functions';

// Power calculation for one-sample t-test
export const powerOneSampleTTest = (
  sampleSize: number,
  effectSize: number,
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  const params: PowerParameters = {
    test: "ttest-one-sample",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    tailType
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for two-sample t-test (independent samples)
export const powerTwoSampleTTest = (
  sampleSize: number,  // Total sample size
  effectSize: number,
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  const params: PowerParameters = {
    test: "ttest-two-sample",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    tailType
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for paired t-test
export const powerPairedTTest = (
  sampleSize: number,
  effectSize: number,
  alpha: number,
  correlation: number = 0.5,
  tailType: "one" | "two" = "two"
): number => {
  const params: PowerParameters = {
    test: "ttest-paired",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    correlation,
    tailType
  };
  return goldStandardPower(params) || 0;
};

/**
 * One-way ANOVA power calculation (Cohen's f)
 */
export const powerOneWayANOVA = (sampleSize: number, effectSize: number, alpha: number, groups: number = 3): number => {
  const params: PowerParameters = {
    test: "anova",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    groups
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for correlation test
export const powerCorrelation = (
  sampleSize: number,
  effectSize: number, // correlation coefficient r
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  const params: PowerParameters = {
    test: "correlation",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    tailType
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for chi-square tests
export const powerChiSquare = (
  sampleSize: number,
  effectSize: number, // Cohen's w
  alpha: number,
  df: number
): number => {
  const params: PowerParameters = {
    test: "chi-square-gof",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    groups: df + 1
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for proportion test
export const powerProportionTest = (
  sampleSize: number,
  effectSize: number, // Cohen's h
  alpha: number,
  tailType: "one" | "two" = "two"
): number => {
  const params: PowerParameters = {
    test: "proportion-test",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    tailType
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for linear regression
export const powerLinearRegression = (
  sampleSize: number,
  effectSize: number, // f²
  alpha: number,
  predictors: number = 1
): number => {
  const params: PowerParameters = {
    test: "multiple-regression",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    predictors
  };
  return goldStandardPower(params) || 0;
};

/**
 * Multiple regression power calculation (Cohen's f²)
 */
export const powerMultipleRegression = (sampleSize: number, effectSize: number, alpha: number, predictors: number = 3): number => {
  const params: PowerParameters = {
    test: "multiple-regression",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    predictors
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for SEM (Structural Equation Modeling)
export const powerSEM = (
  sampleSize: number,
  effectSize: number, // RMSEA
  alpha: number,
  df: number = 10
): number => {
  const params: PowerParameters = {
    test: "sem",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    degreesOfFreedom: df
  };
  return goldStandardPower(params) || 0;
};

// Power calculation for MMRM (Mixed-Model Repeated Measures)
export const powerMMRM = (
  sampleSize: number,
  effectSize: number,
  alpha: number,
  timePoints: number = 4,
  dropoutRate: number = 0.05,
  correlation: number = 0.5,
  groups: number = 2,
  tailType: "one" | "two" = "two"
): number => {
  const params: PowerParameters = {
    test: "mmrm",
    sampleSize,
    effectSize,
    significanceLevel: alpha,
    power: null,
    timePoints,
    dropoutRate,
    withinCorrelation: correlation,
    groups,
    tailType
  };
  return goldStandardPower(params) || 0;
};