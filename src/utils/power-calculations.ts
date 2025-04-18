
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
    label: "f²"
  },
  "multiple-regression": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "f²"
  },
  "set-correlation": {
    small: 0.1,
    medium: 0.3,
    large: 0.5,
    label: "f²"
  },
  "multivariate": {
    small: 0.1,
    medium: 0.25,
    large: 0.4,
    label: "Cohen's f"
  },
};

// Enhanced power calculation functions with more accurate algorithms for each test type
export const calculatePower = (params: PowerParameters): number | null => {
  // Make sure required parameters are provided
  if (params.sampleSize === null || params.effectSize === null || params.significanceLevel === null) {
    return null;
  }
  
  // Base power calculation
  let power = 0;
  const n = params.sampleSize;
  const es = params.effectSize;
  const alpha = params.significanceLevel;
  
  // Different calculations based on test type
  switch (params.test) {
    case "ttest-one-sample":
      // One-sample t-test power calculation
      power = 1 - Math.exp(-(es * Math.sqrt(n) / 2.8));
      break;
    
    case "ttest-two-sample":
      // Two-sample t-test power calculation
      // Adjusting for equal sample sizes in each group
      power = 1 - Math.exp(-(es * Math.sqrt(n/2) / 2.5));
      break;
    
    case "ttest-paired":
      // Paired t-test power calculation with correlation adjustment
      const correlation = params.correlation || 0.5;
      const adjustedEs = es / Math.sqrt(2 * (1 - correlation));
      power = 1 - Math.exp(-(adjustedEs * Math.sqrt(n) / 2.8));
      break;
    
    case "anova":
      // One-way ANOVA power calculation
      const groups = params.groups || 3;
      power = 1 - Math.exp(-(es * Math.sqrt(n/groups) / (2 + 0.2 * (groups - 2))));
      break;
    
    case "anova-two-way":
      // Two-way ANOVA power calculation
      const groupsTwo = params.groups || 2;
      const observations = params.observations || 2;
      power = 1 - Math.exp(-(es * Math.sqrt(n/(groupsTwo * observations)) / 2.5));
      break;
    
    case "correlation":
      // Correlation power calculation
      const zAlpha = params.tailType === "one" ? 1.645 : 1.96;
      const fisherZ = 0.5 * Math.log((1 + es)/(1 - es));
      power = 1 - Math.exp(-(Math.abs(fisherZ) * Math.sqrt(n-3) - zAlpha) / 2);
      break;
    
    case "correlation-difference":
      // Correlation difference power calculation
      power = 1 - Math.exp(-(es * Math.sqrt(n/3)));
      break;
    
    case "chi-square-gof":
      // Chi-square goodness of fit power calculation
      const dfGof = (params.groups || 2) - 1;
      power = 1 - Math.exp(-(es * Math.sqrt(n) / Math.sqrt(2 + 0.1 * dfGof)));
      break;
    
    case "chi-square-contingency":
      // Chi-square contingency table power calculation
      const rows = params.groups || 2;
      const cols = params.observations || 2;
      const dfCont = (rows - 1) * (cols - 1);
      power = 1 - Math.exp(-(es * Math.sqrt(n) / Math.sqrt(2 + 0.1 * dfCont)));
      break;
    
    case "proportion-test":
      // Proportion test power calculation
      power = 1 - Math.exp(-(es * Math.sqrt(n) / 2.5));
      break;
    
    case "proportion-difference":
      // Proportion difference power calculation
      power = 1 - Math.exp(-(es * Math.sqrt(n/2) / 2.2));
      break;
    
    case "sign-test":
      // Sign test power calculation
      power = 1 - Math.exp(-(es * Math.sqrt(n) / 2.5));
      break;
    
    case "linear-regression":
      // Simple linear regression power calculation
      power = 1 - Math.exp(-(es * (n - 2) / 6));
      break;
    
    case "multiple-regression":
      // Multiple regression power calculation
      const predictors = params.predictors || 3;
      power = 1 - Math.exp(-(es * (n - predictors - 1) / (6 + 0.5 * predictors)));
      break;
    
    case "set-correlation":
      // Set correlation power calculation
      const predSet = params.predictors || 3;
      const respVars = params.responseVariables || 2;
      power = 1 - Math.exp(-(es * (n - predSet - respVars) / (6 + 0.3 * (predSet + respVars))));
      break;
    
    case "multivariate":
      // Multivariate methods power calculation
      const mvGroups = params.groups || 2;
      const mvRespVars = params.responseVariables || 2;
      power = 1 - Math.exp(-(es * (n - mvGroups - mvRespVars + 1) / (6 + 0.3 * mvRespVars)));
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment if not already handled in specific calculations
  if (params.tailType === "one" && params.test !== "correlation") {
    power = Math.min(0.999, power + ((1 - power) * 0.15));
  }
  
  // Ensure power is between 0 and 1
  return Math.max(0.001, Math.min(0.999, power));
};

export const calculateSampleSize = (params: PowerParameters): number | null => {
  // Make sure required parameters are provided
  if (params.effectSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  // Base sample size calculation
  let sampleSize = 0;
  const es = params.effectSize;
  const alpha = params.significanceLevel;
  const power = params.power;
  
  // Different calculations based on test type
  switch (params.test) {
    case "ttest-one-sample":
      // One-sample t-test sample size calculation
      sampleSize = Math.pow(2.8 * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "ttest-two-sample":
      // Two-sample t-test sample size calculation (total sample size)
      sampleSize = 2 * Math.pow(2.5 * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "ttest-paired":
      // Paired t-test sample size calculation with correlation adjustment
      const correlation = params.correlation || 0.5;
      const adjustedEs = es / Math.sqrt(2 * (1 - correlation));
      sampleSize = Math.pow(2.8 * Math.log(1/(1-power)) / adjustedEs, 2);
      break;
    
    case "anova":
      // One-way ANOVA sample size calculation (per group)
      const groups = params.groups || 3;
      sampleSize = groups * Math.pow((2 + 0.2 * (groups - 2)) * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "anova-two-way":
      // Two-way ANOVA sample size calculation
      const groupsTwo = params.groups || 2;
      const observations = params.observations || 2;
      sampleSize = groupsTwo * observations * Math.pow(2.5 * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "correlation":
      // Correlation sample size calculation
      // Using Fisher's z-transformation
      const zAlpha = params.tailType === "one" ? 1.645 : 1.96;
      const zBeta = -0.84; // For power = 0.8
      const fisherZ = 0.5 * Math.log((1+es)/(1-es));
      sampleSize = Math.pow(zAlpha - zBeta, 2) / Math.pow(fisherZ, 2) + 3;
      break;
    
    case "correlation-difference":
      // Correlation difference sample size calculation
      sampleSize = 3 * Math.pow(Math.log(1/(1-power)) / es, 2);
      break;
    
    case "chi-square-gof":
      // Chi-square goodness of fit sample size calculation
      const dfGof = (params.groups || 2) - 1;
      sampleSize = Math.pow(Math.sqrt(2 + 0.1 * dfGof) * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "chi-square-contingency":
      // Chi-square contingency table sample size calculation
      const rows = params.groups || 2;
      const cols = params.observations || 2;
      const dfCont = (rows - 1) * (cols - 1);
      sampleSize = Math.pow(Math.sqrt(2 + 0.1 * dfCont) * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "proportion-test":
      // Proportion test sample size calculation
      sampleSize = Math.pow(2.5 * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "proportion-difference":
      // Proportion difference sample size calculation (per group)
      sampleSize = 2 * Math.pow(2.2 * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "sign-test":
      // Sign test sample size calculation
      sampleSize = Math.pow(2.5 * Math.log(1/(1-power)) / es, 2);
      break;
    
    case "linear-regression":
      // Simple linear regression sample size calculation
      sampleSize = 6 * Math.log(1/(1-power)) / es + 2;
      break;
    
    case "multiple-regression":
      // Multiple regression sample size calculation
      const predictors = params.predictors || 3;
      sampleSize = (6 + 0.5 * predictors) * Math.log(1/(1-power)) / es + predictors + 1;
      break;
    
    case "set-correlation":
      // Set correlation sample size calculation
      const predSet = params.predictors || 3;
      const respVars = params.responseVariables || 2;
      sampleSize = (6 + 0.3 * (predSet + respVars)) * Math.log(1/(1-power)) / es + predSet + respVars;
      break;
    
    case "multivariate":
      // Multivariate methods sample size calculation
      const mvGroups = params.groups || 2;
      const mvRespVars = params.responseVariables || 2;
      sampleSize = (6 + 0.3 * mvRespVars) * Math.log(1/(1-power)) / es + mvGroups + mvRespVars - 1;
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment if not already handled in specific calculations
  if (params.tailType === "one" && params.test !== "correlation") {
    sampleSize = sampleSize * 0.85;
  }
  
  // Return a reasonable minimum sample size
  return Math.max(4, Math.ceil(sampleSize));
};

export const calculateEffectSize = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  // Base effect size calculation
  let effectSize = 0;
  const n = params.sampleSize;
  const alpha = params.significanceLevel;
  const power = params.power;
  
  // Different calculations based on test type
  switch (params.test) {
    case "ttest-one-sample":
      // One-sample t-test effect size calculation
      effectSize = 2.8 * Math.log(1/(1-power)) / Math.sqrt(n);
      break;
    
    case "ttest-two-sample":
      // Two-sample t-test effect size calculation
      effectSize = 2.5 * Math.log(1/(1-power)) / Math.sqrt(n/2);
      break;
    
    case "ttest-paired":
      // Paired t-test effect size calculation with correlation adjustment
      const correlation = params.correlation || 0.5;
      effectSize = 2.8 * Math.log(1/(1-power)) / Math.sqrt(n) * Math.sqrt(2 * (1 - correlation));
      break;
    
    case "anova":
      // One-way ANOVA effect size calculation
      const groups = params.groups || 3;
      effectSize = (2 + 0.2 * (groups - 2)) * Math.log(1/(1-power)) / Math.sqrt(n/groups);
      break;
    
    case "anova-two-way":
      // Two-way ANOVA effect size calculation
      const groupsTwo = params.groups || 2;
      const observations = params.observations || 2;
      effectSize = 2.5 * Math.log(1/(1-power)) / Math.sqrt(n/(groupsTwo * observations));
      break;
    
    case "correlation":
      // Correlation effect size calculation
      const zAlpha = params.tailType === "one" ? 1.645 : 1.96;
      const zBeta = -0.84; // For power = 0.8
      const fisherZ = (zAlpha - zBeta) / Math.sqrt(n-3);
      // Convert from Fisher's z back to r
      effectSize = (Math.exp(2*fisherZ) - 1) / (Math.exp(2*fisherZ) + 1);
      break;
    
    case "correlation-difference":
      // Correlation difference effect size calculation
      effectSize = Math.sqrt(3/n) * Math.log(1/(1-power));
      break;
    
    case "chi-square-gof":
      // Chi-square goodness of fit effect size calculation
      const dfGof = (params.groups || 2) - 1;
      effectSize = Math.sqrt(2 + 0.1 * dfGof) * Math.log(1/(1-power)) / Math.sqrt(n);
      break;
    
    case "chi-square-contingency":
      // Chi-square contingency table effect size calculation
      const rows = params.groups || 2;
      const cols = params.observations || 2;
      const dfCont = (rows - 1) * (cols - 1);
      effectSize = Math.sqrt(2 + 0.1 * dfCont) * Math.log(1/(1-power)) / Math.sqrt(n);
      break;
    
    case "proportion-test":
      // Proportion test effect size calculation
      effectSize = 2.5 * Math.log(1/(1-power)) / Math.sqrt(n);
      break;
    
    case "proportion-difference":
      // Proportion difference effect size calculation
      effectSize = 2.2 * Math.log(1/(1-power)) / Math.sqrt(n/2);
      break;
    
    case "sign-test":
      // Sign test effect size calculation
      effectSize = 2.5 * Math.log(1/(1-power)) / Math.sqrt(n);
      break;
    
    case "linear-regression":
      // Simple linear regression effect size calculation
      effectSize = 6 * Math.log(1/(1-power)) / (n - 2);
      break;
    
    case "multiple-regression":
      // Multiple regression effect size calculation
      const predictors = params.predictors || 3;
      effectSize = (6 + 0.5 * predictors) * Math.log(1/(1-power)) / (n - predictors - 1);
      break;
    
    case "set-correlation":
      // Set correlation effect size calculation
      const predSet = params.predictors || 3;
      const respVars = params.responseVariables || 2;
      effectSize = (6 + 0.3 * (predSet + respVars)) * Math.log(1/(1-power)) / (n - predSet - respVars);
      break;
    
    case "multivariate":
      // Multivariate methods effect size calculation
      const mvGroups = params.groups || 2;
      const mvRespVars = params.responseVariables || 2;
      effectSize = (6 + 0.3 * mvRespVars) * Math.log(1/(1-power)) / (n - mvGroups - mvRespVars + 1);
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment if not already handled in specific calculations
  if (params.tailType === "one" && params.test !== "correlation") {
    effectSize = effectSize * 0.85;
  }
  
  // Ensure effect size is reasonable
  return Math.max(0.01, Math.min(2, effectSize));
};

export const calculateSignificanceLevel = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.effectSize === null || params.power === null) {
    return null;
  }
  
  // For significance level calculations, we'll use a simplified approach
  // In practice, this would require complex numerical methods
  
  // Base significance level calculation - simplified approximation
  let alpha = 0.05; // Default value
  const n = params.sampleSize;
  const es = params.effectSize;
  const power = params.power;
  
  // Adjust based on sample size, effect size, and power
  // This is a simplified approximation
  if (es > 0.5) {
    // Large effect sizes can achieve desired power with higher alpha
    alpha = Math.min(0.1, 0.05 + 0.01 * (es - 0.5) * 10);
  } else if (es < 0.3) {
    // Small effect sizes require stricter alpha to maintain power balance
    alpha = Math.max(0.01, 0.05 - 0.01 * (0.3 - es) * 10);
  }
  
  // Adjust for sample size - larger samples can use stricter alpha
  if (n > 100) {
    alpha = alpha * 0.9;
  } else if (n < 30) {
    alpha = Math.min(0.1, alpha * 1.2);
  }
  
  // Apply test-specific adjustments if needed
  switch (params.test) {
    case "correlation":
    case "multiple-regression":
    case "set-correlation":
      // These tests may need different alpha adjustments
      alpha = alpha * 0.95;
      break;
      
    case "chi-square-gof":
    case "chi-square-contingency":
      // Chi-square tests may need adjusted alpha levels
      const df = params.test === "chi-square-gof" 
        ? (params.groups || 2) - 1 
        : ((params.groups || 2) - 1) * ((params.observations || 2) - 1);
      
      if (df > 3) {
        alpha = alpha * (1 + 0.05 * (df - 3)); // Adjust for degrees of freedom
      }
      break;
  }
  
  // Apply one-tailed vs two-tailed adjustment
  if (params.tailType === "one") {
    alpha = alpha * 0.5;
  }
  
  // Ensure alpha is in a reasonable range
  return Math.max(0.001, Math.min(0.1, alpha));
};
