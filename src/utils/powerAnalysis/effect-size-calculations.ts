
/**
 * Effect size calculation functions
 */

import { normInv } from './statistical-functions';
import { PowerParameters } from '@/types/power-analysis';

/**
 * Effect size calculation function based on test type
 */
export const calculateScientificEffectSize = (params: PowerParameters): number | null => {
  if (params.sampleSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  const n = params.sampleSize;
  const alpha = params.significanceLevel;
  const desiredPower = params.power;
  const tailType = params.tailType || "two";
  
  // Critical z-values for alpha and beta
  const z_alpha = tailType === "two" ? normInv(1 - alpha / 2) : normInv(1 - alpha);
  const z_beta = normInv(desiredPower);
  
  let effectSize: number;
  
  switch (params.test) {
    case "ttest-one-sample":
      // One-sample t-test
      effectSize = (z_alpha + z_beta) / Math.sqrt(n);
      break;
      
    case "ttest-two-sample":
      // Two-sample t-test
      effectSize = (z_alpha + z_beta) / Math.sqrt(n / 2);
      break;
      
    case "ttest-paired":
      // Paired t-test
      const correlation = params.correlation || 0.5;
      effectSize = ((z_alpha + z_beta) / Math.sqrt(n)) * 
                   Math.sqrt(2 * (1 - correlation));
      break;
      
    case "anova":
      // One-way ANOVA
      const groups = params.groups || 3;
      effectSize = (z_alpha + z_beta) / 
                   Math.sqrt(n / groups) * 
                   Math.sqrt(1 / (1 + (groups - 1) / 3));
      break;
      
    case "anova-two-way":
      // Two-way ANOVA
      const groupsTwo = params.groups || 2;
      const observations = params.observations || 2;
      effectSize = (z_alpha + z_beta) / 
                   Math.sqrt(n / (groupsTwo * observations)) * 
                   Math.sqrt(1 / (1 + (groupsTwo * observations - 1) / 4));
      break;
      
    case "correlation":
      // Correlation test
      // Using Fisher's z transformation
      const fisherZ = (z_alpha + z_beta) / Math.sqrt(n - 3);
      // Convert back to correlation coefficient
      effectSize = (Math.exp(2 * fisherZ) - 1) / (Math.exp(2 * fisherZ) + 1);
      break;
      
    case "correlation-difference":
      // Correlation difference
      const fisherZDiff = (z_alpha + z_beta) / Math.sqrt(n / 2 - 3);
      effectSize = (Math.exp(fisherZDiff) - 1) / (Math.exp(fisherZDiff) + 1);
      break;
      
    case "chi-square-gof":
      // Chi-square goodness of fit
      const dfGof = (params.groups || 2) - 1;
      effectSize = Math.sqrt((Math.pow(z_alpha + z_beta, 2) * (dfGof + 1)) / 
                   (n * dfGof));
      break;
      
    case "chi-square-contingency":
      // Chi-square contingency table
      const rows = params.groups || 2;
      const cols = params.observations || 2;
      const dfCont = (rows - 1) * (cols - 1);
      effectSize = Math.sqrt((Math.pow(z_alpha + z_beta, 2) * (dfCont + 1)) / 
                   (n * dfCont));
      break;
      
    case "proportion-test":
      // Proportion test
      effectSize = (z_alpha + z_beta) / Math.sqrt(n);
      break;
      
    case "proportion-difference":
      // Proportion difference
      effectSize = (z_alpha + z_beta) / Math.sqrt(n / 2);
      break;
      
    case "sign-test":
      // Sign test
      effectSize = (z_alpha + z_beta) / Math.sqrt(n);
      break;
      
    case "linear-regression":
      // Linear regression
      effectSize = Math.sqrt(Math.pow(z_alpha + z_beta, 2) / (n - 2));
      break;
      
    case "multiple-regression":
      // Multiple regression
      const predictors = params.predictors || 3;
      effectSize = Math.sqrt(Math.pow(z_alpha + z_beta, 2) / 
                   (n - predictors - 1));
      break;
      
    case "set-correlation":
      // Set correlation
      const predSet = params.predictors || 3;
      const respVars = params.responseVariables || 2;
      effectSize = Math.sqrt(Math.pow(z_alpha + z_beta, 2) / 
                   (n - predSet - respVars));
      break;
      
    case "multivariate":
      // Multivariate methods
      const mvGroups = params.groups || 2;
      const mvRespVars = params.responseVariables || 2;
      effectSize = Math.sqrt((mvGroups * mvRespVars * 
                   Math.pow(z_alpha + z_beta, 2)) / 
                   (n - mvGroups - mvRespVars + 1));
      break;
      
    default:
      effectSize = 0.5; // Default medium effect size
  }
  
  // Ensure a reasonable effect size range
  return Math.max(0.01, Math.min(2.0, effectSize));
};
