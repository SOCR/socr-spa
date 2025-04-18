import { PowerParameters } from "@/types/power-analysis";

export const EFFECT_SIZE_MAP = {
  "ttest-one-sample": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "ttest-two-sample": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "ttest-paired": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "anova": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
   "anova-two-way": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
  "correlation": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "r"
  },
  "correlation-difference": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "r"
  },
  "chi-square": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "w"
  },
  "chi-square-gof": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "w"
  },
  "chi-square-contingency": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "w"
  },
  "proportion-test": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's h"
  },
  "proportion-difference": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's h"
  },
  "sign-test": {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    label: "Cohen's d"
  },
  "linear-regression": {
     small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "f2"
  },
  "multiple-regression": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "f2"
  },
  "set-correlation": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "f2"
  },
  "multivariate": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
};

// Enhanced power calculation functions to handle test-specific parameters
export const calculatePower = (params: PowerParameters): number | null => {
  // Make sure required parameters are provided
  if (params.sampleSize === null || params.effectSize === null || params.significanceLevel === null) {
    return null;
  }
  
  // Base power calculation (simplified for demo)
  let power = 0.8; // Default fallback
  
  // Different calculations based on test type
  switch (params.test) {
    case "ttest-one-sample":
    case "ttest-two-sample":
    case "ttest-paired":
      // Simplified t-test power calculation
      power = 1 - Math.exp(-params.effectSize * Math.sqrt(params.sampleSize) / 2);
      break;
    
    case "anova":
    case "anova-two-way":
      // Factor in number of groups if available
      const groups = params.groups || 2;
      power = 1 - Math.exp(-params.effectSize * Math.sqrt(params.sampleSize / groups) / 2);
      break;
    
    case "multiple-regression":
    case "linear-regression":
      // Factor in number of predictors if available
      const predictors = params.predictors || 1;
      power = 1 - Math.exp(-params.effectSize * (params.sampleSize - predictors - 1) / 10);
      break;
    
    case "correlation":
    case "correlation-difference":
      // Simple correlation power approximation
      power = 1 - Math.exp(-params.effectSize * params.sampleSize / 3);
      break;
    
    case "chi-square-gof":
    case "chi-square-contingency":
      // Factor in degrees of freedom
      const df = (params.groups || 2) - 1;
      power = 1 - Math.exp(-params.effectSize * params.sampleSize / (4 + df));
      break;
    
    case "proportion-test":
    case "proportion-difference":
    case "sign-test":
      // Proportion tests
      power = 1 - Math.exp(-params.effectSize * Math.sqrt(params.sampleSize) / 2.5);
      break;
    
    case "set-correlation":
    case "multivariate":
      // Multivariate methods
      const responseVars = params.responseVariables || 2;
      power = 1 - Math.exp(-params.effectSize * (params.sampleSize - responseVars) / 4);
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment
  if (params.tailType === "one" && power < 0.95) {
    power = power + ((1 - power) * 0.2); // Approximate adjustment for one-tailed tests
  }
  
  // Ensure power is between 0 and 1
  return Math.max(0, Math.min(0.9999, power));
};

export const calculateSampleSize = (params: PowerParameters): number | null => {
  // Make sure required parameters are provided
  if (params.effectSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  // Base sample size calculation (simplified for demo)
  let sampleSize = 0;
  
  // Different calculations based on test type
  switch (params.test) {
    case "ttest-one-sample":
      sampleSize = Math.pow(-2 * Math.log(1 - params.power) / params.effectSize, 2);
      break;
    
    case "ttest-two-sample":
      sampleSize = Math.pow(-2 * Math.log(1 - params.power) / params.effectSize, 2) * 2;
      break;
    
    case "ttest-paired":
      // Factor in correlation if available
      const correlation = params.correlation || 0.5;
      sampleSize = Math.pow(-2 * Math.log(1 - params.power) / (params.effectSize * Math.sqrt(1 - correlation)), 2);
      break;
    
    case "anova":
    case "anova-two-way":
      // Factor in number of groups
      const groups = params.groups || 2;
      sampleSize = Math.pow(-2 * Math.log(1 - params.power) / params.effectSize, 2) * groups;
      break;
    
    case "multiple-regression":
    case "linear-regression":
      // Factor in number of predictors
      const predictors = params.predictors || 1;
      sampleSize = 10 * (-Math.log(1 - params.power) / params.effectSize) + predictors + 1;
      break;
    
    case "correlation":
    case "correlation-difference":
      sampleSize = 3 * (-Math.log(1 - params.power) / params.effectSize);
      break;
    
    case "chi-square-gof":
    case "chi-square-contingency":
      // Factor in degrees of freedom
      const df = (params.groups || 2) - 1;
      sampleSize = (4 + df) * (-Math.log(1 - params.power) / params.effectSize);
      break;
    
    case "proportion-test":
    case "proportion-difference":
    case "sign-test":
      sampleSize = Math.pow(-2.5 * Math.log(1 - params.power) / params.effectSize, 2);
      break;
    
    case "set-correlation":
    case "multivariate":
      // Multivariate methods
      const responseVars = params.responseVariables || 2;
      sampleSize = 4 * (-Math.log(1 - params.power) / params.effectSize) + responseVars;
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment
  if (params.tailType === "one") {
    sampleSize = sampleSize * 0.8; // Approximate adjustment for one-tailed tests
  }
  
  // Return a reasonable minimum sample size
  return Math.max(4, Math.ceil(sampleSize));
};

export const calculateEffectSize = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  // Base effect size calculation (simplified for demo)
  let effectSize = 0;
  
  // Different calculations based on test type
  switch (params.test) {
    case "ttest-one-sample":
      effectSize = -2 * Math.log(1 - params.power) / Math.sqrt(params.sampleSize);
      break;
    
    case "ttest-two-sample":
      effectSize = -2 * Math.log(1 - params.power) / Math.sqrt(params.sampleSize / 2);
      break;
    
    case "ttest-paired":
      // Factor in correlation if available
      const correlation = params.correlation || 0.5;
      effectSize = -2 * Math.log(1 - params.power) / (Math.sqrt(params.sampleSize) * Math.sqrt(1 - correlation));
      break;
    
    case "anova":
    case "anova-two-way":
      // Factor in number of groups
      const groups = params.groups || 2;
      effectSize = -2 * Math.log(1 - params.power) / Math.sqrt(params.sampleSize / groups);
      break;
    
    case "multiple-regression":
    case "linear-regression":
      // Factor in number of predictors
      const predictors = params.predictors || 1;
      effectSize = -Math.log(1 - params.power) * 10 / (params.sampleSize - predictors - 1);
      break;
    
    case "correlation":
    case "correlation-difference":
      effectSize = -Math.log(1 - params.power) * 3 / params.sampleSize;
      break;
    
    case "chi-square-gof":
    case "chi-square-contingency":
      // Factor in degrees of freedom
      const df = (params.groups || 2) - 1;
      effectSize = -Math.log(1 - params.power) * (4 + df) / params.sampleSize;
      break;
    
    case "proportion-test":
    case "proportion-difference":
    case "sign-test":
      effectSize = -2.5 * Math.log(1 - params.power) / Math.sqrt(params.sampleSize);
      break;
    
    case "set-correlation":
    case "multivariate":
      // Multivariate methods
      const responseVars = params.responseVariables || 2;
      effectSize = -Math.log(1 - params.power) * 4 / (params.sampleSize - responseVars);
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment
  if (params.tailType === "one" && effectSize > 0.05) {
    effectSize = effectSize * 0.8; // Approximate adjustment for one-tailed tests
  }
  
  // Ensure effect size is reasonable
  return Math.max(0.01, Math.min(2, effectSize));
};

export const calculateSignificanceLevel = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.effectSize === null || params.power === null) {
    return null;
  }
  
  // A very simplified calculation that should be replaced with proper formulas
  // This is just a placeholder approximation
  let alpha = 0.05; // Default value
  
  // Adjust based on sample size and effect size
  alpha = 0.05 * Math.pow(params.effectSize / 0.5, 0.5) * Math.pow(30 / params.sampleSize, 0.5);
  
  // Apply test-specific adjustments if needed
  // ... (similar to other calculation functions)
  
  // Apply one-tailed vs two-tailed adjustment
  if (params.tailType === "one") {
    alpha = alpha * 0.5; // Approximate adjustment for one-tailed tests
  }
  
  // Ensure alpha is in a reasonable range
  return Math.max(0.001, Math.min(0.1, alpha));
};
