/**
 * Calculation Stability Utilities
 * 
 * This module provides functions to ensure stable and consistent power analysis calculations
 * by implementing bounds checking, numerical stability, and parameter validation.
 */

import { PowerParameters } from "@/types/power-analysis";

/**
 * Validates parameters and provides stability bounds
 */
export const validateAndStabilizeParams = (params: PowerParameters): PowerParameters => {
  const stabilized = { ...params };
  
  // Stabilize sample size
  if (stabilized.sampleSize !== null) {
    stabilized.sampleSize = Math.max(4, Math.min(10000, Math.round(stabilized.sampleSize)));
  }
  
  // Stabilize effect size with test-specific bounds
  if (stabilized.effectSize !== null) {
    switch (stabilized.test) {
      case "correlation":
      case "correlation-difference":
        // Correlation coefficients: -1 to 1
        stabilized.effectSize = Math.max(-0.999, Math.min(0.999, stabilized.effectSize));
        break;
      case "sem":
        // RMSEA: 0 to 0.3 (reasonable upper bound)
        stabilized.effectSize = Math.max(0.001, Math.min(0.3, stabilized.effectSize));
        break;
      case "multiple-regression":
      case "linear-regression":
        // f² effect size: 0 to 1 (very large effects beyond 1 are rare)
        stabilized.effectSize = Math.max(0.001, Math.min(1.0, stabilized.effectSize));
        break;
      default:
        // Cohen's d and similar: reasonable bounds
        stabilized.effectSize = Math.max(0.01, Math.min(3.0, stabilized.effectSize));
    }
    // Round to prevent micro-fluctuations
    stabilized.effectSize = Math.round(stabilized.effectSize * 1000) / 1000;
  }
  
  // Stabilize power
  if (stabilized.power !== null) {
    stabilized.power = Math.max(0.05, Math.min(0.99, stabilized.power));
    stabilized.power = Math.round(stabilized.power * 1000) / 1000;
  }
  
  // Stabilize significance level
  if (stabilized.significanceLevel !== null) {
    stabilized.significanceLevel = Math.max(0.001, Math.min(0.3, stabilized.significanceLevel));
    stabilized.significanceLevel = Math.round(stabilized.significanceLevel * 1000) / 1000;
  }
  
  // Stabilize additional parameters
  if (stabilized.groups !== null) {
    stabilized.groups = Math.max(2, Math.min(20, Math.round(stabilized.groups)));
  }
  
  if (stabilized.predictors !== null) {
    stabilized.predictors = Math.max(1, Math.min(50, Math.round(stabilized.predictors)));
  }
  
  if (stabilized.responseVariables !== null) {
    stabilized.responseVariables = Math.max(1, Math.min(20, Math.round(stabilized.responseVariables)));
  }
  
  if (stabilized.degreesOfFreedom !== null) {
    stabilized.degreesOfFreedom = Math.max(1, Math.min(1000, Math.round(stabilized.degreesOfFreedom)));
  }
  
  if (stabilized.correlation !== null) {
    stabilized.correlation = Math.max(-0.999, Math.min(0.999, stabilized.correlation));
    stabilized.correlation = Math.round(stabilized.correlation * 1000) / 1000;
  }
  
  return stabilized;
};

/**
 * Check if calculation result is reasonable given the inputs
 */
export const validateCalculationResult = (
  result: number | null, 
  targetParameter: string, 
  params: PowerParameters
): { isValid: boolean; warning?: string } => {
  if (result === null || !isFinite(result) || isNaN(result)) {
    return { isValid: false, warning: "Calculation failed or returned invalid result" };
  }
  
  // Check for unreasonable results that might indicate calculation errors
  switch (targetParameter) {
    case "sampleSize":
      if (result < 4) {
        return { isValid: false, warning: "Sample size too small for reliable analysis" };
      }
      if (result > 50000) {
        return { isValid: false, warning: "Sample size seems unreasonably large - check your parameters" };
      }
      break;
      
    case "power":
      if (result < 0.001 || result > 0.999) {
        return { isValid: false, warning: "Power value out of valid range" };
      }
      break;
      
    case "effectSize":
      const maxReasonableEffect = params.test === "correlation" ? 0.95 : 3.0;
      if (result > maxReasonableEffect) {
        return { isValid: false, warning: "Effect size seems unreasonably large" };
      }
      break;
      
    case "significanceLevel":
      if (result < 0.001 || result > 0.5) {
        return { isValid: false, warning: "Significance level out of reasonable range" };
      }
      break;
  }
  
  return { isValid: true };
};

/**
 * Prevent drastic changes by implementing parameter change dampening
 */
export const dampParameterChange = (
  oldValue: number | null, 
  newValue: number | null, 
  maxChangeRatio: number = 2.0
): number | null => {
  if (oldValue === null || newValue === null) return newValue;
  
  const ratio = Math.abs(newValue / oldValue);
  
  // If change is too drastic, dampen it
  if (ratio > maxChangeRatio) {
    const dampened = oldValue * (newValue > oldValue ? maxChangeRatio : 1 / maxChangeRatio);
    return dampened;
  }
  
  return newValue;
};