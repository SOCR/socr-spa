
/**
 * Sample size calculation functions
 */

import { normInv } from './statistical-functions';
import { PowerParameters } from '@/types/power-analysis';

/**
 * Sample size calculation function based on test type
 */
export const calculateScientificSampleSize = (params: PowerParameters): number | null => {
  if (params.effectSize === null || params.significanceLevel === null || params.power === null) {
    return null;
  }
  
  const es = params.effectSize;
  const alpha = params.significanceLevel;
  const desiredPower = params.power;
  const tailType = params.tailType || "two";
  
  // Critical z-values for alpha and beta
  const z_alpha = tailType === "two" ? normInv(1 - alpha / 2) : normInv(1 - alpha);
  const z_beta = normInv(desiredPower);
  
  let sampleSize: number;
  
  switch (params.test) {
    case "ttest-one-sample":
      // One-sample t-test
      sampleSize = Math.pow((z_alpha + z_beta) / es, 2);
      break;
      
    case "ttest-two-sample":
      // Two-sample t-test (total sample size across both groups)
      sampleSize = 2 * Math.pow((z_alpha + z_beta) / es, 2);
      break;
      
    case "ttest-paired":
      // Paired t-test
      const correlation = params.correlation || 0.5;
      const adjustedEs = es / Math.sqrt(2 * (1 - correlation));
      sampleSize = Math.pow((z_alpha + z_beta) / adjustedEs, 2);
      break;
      
    case "anova":
      // One-way ANOVA
      const groups = params.groups || 3;
      // For ANOVA, we need to account for multiple groups
      sampleSize = groups * Math.pow((z_alpha + z_beta) / es, 2) * 
                   (1 + (groups - 1) / 3); // Adjustment for multiple comparisons
      break;
      
    case "anova-two-way":
      // Two-way ANOVA
      const groupsTwo = params.groups || 2;
      const observations = params.observations || 2;
      sampleSize = groupsTwo * observations * 
                   Math.pow((z_alpha + z_beta) / es, 2) * 
                   (1 + (groupsTwo * observations - 1) / 4);
      break;
      
    case "correlation":
      // Correlation test
      // Using Fisher's z transformation
      sampleSize = Math.pow((z_alpha + z_beta) / 
                  (0.5 * Math.log((1 + es) / (1 - es))), 2) + 3;
      break;
      
    case "correlation-difference":
      // Correlation difference
      sampleSize = 2 * (Math.pow((z_alpha + z_beta) / 
                   (Math.log((1 + es) / (1 - es))), 2) + 3);
      break;
      
    case "chi-square-gof":
      // Chi-square goodness of fit
      const dfGof = (params.groups || 2) - 1;
      sampleSize = (Math.pow(z_alpha + z_beta, 2) * (dfGof + 1)) / 
                   (es * es * dfGof);
      break;
      
    case "chi-square-contingency":
      // Chi-square contingency table
      const rows = params.groups || 2;
      const cols = params.observations || 2;
      const dfCont = (rows - 1) * (cols - 1);
      sampleSize = (Math.pow(z_alpha + z_beta, 2) * (dfCont + 1)) / 
                   (es * es * dfCont);
      break;
      
    case "proportion-test":
      // Proportion test
      sampleSize = Math.pow((z_alpha + z_beta) / es, 2);
      break;
      
    case "proportion-difference":
      // Proportion difference (per group)
      sampleSize = 2 * Math.pow((z_alpha + z_beta) / es, 2);
      break;
      
    case "sign-test":
      // Sign test
      sampleSize = Math.pow((z_alpha + z_beta) / es, 2);
      break;
      
    case "linear-regression":
      // Linear regression
      sampleSize = 2 + (Math.pow(z_alpha + z_beta, 2)) / (es * es);
      break;
      
    case "multiple-regression":
      // Multiple regression
      const predictors = params.predictors || 3;
      sampleSize = (predictors + 1) + (Math.pow(z_alpha + z_beta, 2)) / (es * es);
      break;
      
    case "set-correlation":
      // Set correlation
      const predSet = params.predictors || 3;
      const respVars = params.responseVariables || 2;
      sampleSize = (predSet + respVars + 1) + 
                   (Math.pow(z_alpha + z_beta, 2)) / (es * es);
      break;
      
    case "multivariate":
      // Multivariate methods
      const mvGroups = params.groups || 2;
      const mvRespVars = params.responseVariables || 2;
      sampleSize = (mvGroups + mvRespVars - 1) + 
                   (mvGroups * mvRespVars * Math.pow(z_alpha + z_beta, 2)) / 
                   (es * es);
      break;
      
    default:
      sampleSize = 30; // Default fallback
  }
  
  // Ensure a reasonable minimum sample size
  return Math.max(4, Math.ceil(sampleSize));
};
