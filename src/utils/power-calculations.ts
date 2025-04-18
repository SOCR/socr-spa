
import { PowerParameters, StatisticalTest, TestEffectSizeMap } from "@/types/power-analysis";

// Constants for Cohen's effect size categories
export const EFFECT_SIZE_MAP: TestEffectSizeMap = {
  "ttest-one-sample": { small: 0.2, medium: 0.5, large: 0.8, label: "Cohen's d" },
  "ttest-two-sample": { small: 0.2, medium: 0.5, large: 0.8, label: "Cohen's d" },
  "ttest-paired": { small: 0.2, medium: 0.5, large: 0.8, label: "Cohen's d" },
  "anova": { small: 0.1, medium: 0.25, large: 0.4, label: "Cohen's f" },
  "correlation": { small: 0.1, medium: 0.3, large: 0.5, label: "Cohen's r" },
  "chi-square": { small: 0.1, medium: 0.3, large: 0.5, label: "Cohen's w" },
  "linear-regression": { small: 0.02, medium: 0.15, large: 0.35, label: "Cohen's f²" },
};

// Normal distribution cumulative density function
function normCDF(x: number): number {
  // Approximation of the normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) p = 1 - p;
  return p;
}

// Normal distribution inverse cumulative density function (approximation)
function normInv(p: number): number {
  // Approximation of the inverse normal CDF
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  const a1 = -39.6968302866538;
  const a2 = 220.946098424521;
  const a3 = -275.928510446969;
  const a4 = 138.357751867269;
  const a5 = -30.6647980661472;
  const a6 = 2.50662827745924;

  const b1 = -54.4760987982241;
  const b2 = 161.585836858041;
  const b3 = -155.698979859887;
  const b4 = 66.8013118877197;
  const b5 = -13.2806815528857;

  const c1 = -7.78489400243029E-03;
  const c2 = -0.322396458041136;
  const c3 = -2.40075827716184;
  const c4 = -2.54973253934373;
  const c5 = 4.37466414146497;
  const c6 = 2.93816398269878;

  const d1 = 7.78469570904146E-03;
  const d2 = 0.32246712907004;
  const d3 = 2.445134137143;
  const d4 = 3.75440866190742;

  let q = p - 0.5;
  let r;

  if (Math.abs(q) <= 0.42) {
    r = q * q;
    let ppnd = q * (((a5 * r + a4) * r + a3) * r + a2) * r + a1;
    ppnd = ppnd / (((b5 * r + b4) * r + b3) * r + b2) * r + b1;
    return ppnd;
  } else {
    if (q <= 0) r = p;
    else r = 1 - p;
    
    r = Math.sqrt(-Math.log(r));
    
    if (r <= 5) {
      r = r - 1.6;
      let ppnd = (((((c6 * r + c5) * r + c4) * r + c3) * r + c2) * r + c1);
      ppnd = ppnd / (((d4 * r + d3) * r + d2) * r + d1);
      
      if (q <= 0) return -ppnd;
      else return ppnd;
    } else {
      r = r - 5;
      let ppnd = (((((c6 * r + c5) * r + c4) * r + c3) * r + c2) * r + c1);
      ppnd = ppnd / (((d4 * r + d3) * r + d2) * r + d1);
      
      if (q <= 0) return -ppnd;
      else return ppnd;
    }
  }
}

function tCDF(t: number, df: number): number {
  // This is a simple approximation of the t-distribution CDF
  // More accurate implementations would use a proper statistical library
  // For now, this will be close enough for our visualization needs
  if (df > 100) return normCDF(t);
  
  // Approximate t-distribution with adjusted normal distribution
  const x = df / (df + t * t);
  let p = 1 - 0.5 * Math.pow(x, df / 2);
  if (t < 0) p = 1 - p;
  return p;
}

function tInv(p: number, df: number): number {
  // Approximate inverse t-distribution
  // For high df, the t-distribution approaches the normal distribution
  if (df > 100) return normInv(p);
  
  // Bisection method for approximation
  let low = -10;
  let high = 10;
  let mid = 0;
  let pMid = 0;
  
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    pMid = tCDF(mid, df);
    
    if (Math.abs(pMid - p) < 0.0001) break;
    
    if (pMid < p) low = mid;
    else high = mid;
  }
  
  return mid;
}

export function calculatePower(params: PowerParameters): number | null {
  const { test, sampleSize, effectSize, significanceLevel } = params;
  
  if (sampleSize === null || effectSize === null || significanceLevel === null) return null;
  
  // For t-tests
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const df = test === "ttest-one-sample" ? sampleSize - 1 : 
              test === "ttest-paired" ? sampleSize - 1 : 
              2 * sampleSize - 2;
    
    const criticalT = tInv(1 - significanceLevel / 2, df);
    const ncp = effectSize * Math.sqrt(sampleSize); // Non-centrality parameter
    const power = 1 - tCDF(criticalT - ncp, df);
    
    return power;
  }
  
  // For ANOVA
  if (test === "anova") {
    // Simple approximation for ANOVA with k=4 groups
    const k = 4; // Assume 4 groups for ANOVA
    const n = sampleSize; // Sample size per group
    const totalN = n * k;
    const dfBetween = k - 1;
    const dfWithin = totalN - k;
    
    const fCritical = 2.6; // Approximated F critical value for alpha=0.05
    const lambda = totalN * effectSize * effectSize;
    
    // Approximated power calculation
    const power = 1 - 0.5 * Math.exp(-0.3 * (lambda - fCritical));
    
    return Math.min(Math.max(0, power), 1); // Clamp between 0 and 1
  }
  
  // For correlation
  if (test === "correlation") {
    const z = 0.5 * Math.log((1 + effectSize) / (1 - effectSize)); // Fisher's z transformation
    const se = 1 / Math.sqrt(sampleSize - 3);
    const criticalZ = normInv(1 - significanceLevel / 2);
    
    const power = 1 - normCDF(criticalZ - Math.abs(z) / se);
    
    return power;
  }
  
  // For chi-square
  if (test === "chi-square") {
    // Simplistic approximation for chi-square with df=3
    const df = 3;
    const ncp = sampleSize * effectSize * effectSize;
    
    // Very simplified approximation
    const power = 1 - Math.exp(-0.5 * (ncp - Math.sqrt(2 * df) - normInv(1 - significanceLevel)));
    
    return Math.min(Math.max(0, power), 1);
  }
  
  // For linear regression
  if (test === "linear-regression") {
    // Simplified calculation for multiple regression
    const u = 3; // Number of predictors
    const v = sampleSize - u - 1; // Error degrees of freedom
    
    const fCritical = 2.8; // Approximated F critical value
    const lambda = v * effectSize;
    
    // Approximated power
    const power = 1 - 0.5 * Math.exp(-0.2 * (lambda - fCritical));
    
    return Math.min(Math.max(0, power), 1);
  }
  
  return null;
}

export function calculateSampleSize(params: PowerParameters): number | null {
  const { test, effectSize, significanceLevel, power } = params;
  
  if (effectSize === null || significanceLevel === null || power === null) return null;
  
  // For t-tests (very simplified approximation)
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    
    let n: number;
    if (test === "ttest-one-sample" || test === "ttest-paired") {
      n = Math.pow((za + zb) / effectSize, 2);
    } else {
      n = 2 * Math.pow((za + zb) / effectSize, 2);
    }
    
    return Math.ceil(n);
  }
  
  // For ANOVA
  if (test === "anova") {
    // Simple approximation for ANOVA with k=4 groups
    const k = 4;
    const lambda = -Math.log(2 * (1 - power)) / 0.3 + 2.6; // Solve for lambda
    const n = Math.ceil(lambda / (k * effectSize * effectSize));
    
    return Math.max(2, n); // Minimum 2 samples per group
  }
  
  // For correlation
  if (test === "correlation") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    const z = 0.5 * Math.log((1 + effectSize) / (1 - effectSize));
    
    const n = Math.ceil((Math.pow(za + zb, 2) / Math.pow(z, 2)) + 3);
    
    return n;
  }
  
  // For chi-square
  if (test === "chi-square") {
    // Simplified approximation
    const criticalValue = normInv(1 - significanceLevel) + Math.sqrt(2 * 3); // df=3
    const ncp = -Math.log(1 - power) * 2 + criticalValue;
    const n = Math.ceil(ncp / (effectSize * effectSize));
    
    return Math.max(5, n); // Minimum 5 samples
  }
  
  // For linear regression
  if (test === "linear-regression") {
    const u = 3; // Number of predictors
    const lambda = -Math.log(2 * (1 - power)) / 0.2 + 2.8; // Solve for lambda
    const n = Math.ceil(lambda / effectSize + u + 1);
    
    return Math.max(u + 2, n); // Minimum n > number of predictors
  }
  
  return null;
}

export function calculateEffectSize(params: PowerParameters): number | null {
  const { test, sampleSize, significanceLevel, power } = params;
  
  if (sampleSize === null || significanceLevel === null || power === null) return null;
  
  // For t-tests
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    
    let d: number;
    if (test === "ttest-one-sample" || test === "ttest-paired") {
      d = (za + zb) / Math.sqrt(sampleSize);
    } else {
      d = (za + zb) / Math.sqrt(sampleSize / 2);
    }
    
    return d;
  }
  
  // For ANOVA
  if (test === "anova") {
    // Simple approximation for ANOVA with k=4 groups
    const k = 4;
    const lambda = -Math.log(2 * (1 - power)) / 0.3 + 2.6; // Solve for lambda
    const f = Math.sqrt(lambda / (k * sampleSize));
    
    return f;
  }
  
  // For correlation
  if (test === "correlation") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    const fisher_z = Math.sqrt((Math.pow(za + zb, 2) / (sampleSize - 3)));
    
    // Convert Fisher's z back to correlation
    const r = (Math.exp(2 * fisher_z) - 1) / (Math.exp(2 * fisher_z) + 1);
    
    return Math.min(r, 1); // Cap at 1
  }
  
  // For chi-square
  if (test === "chi-square") {
    // Simplified approximation
    const criticalValue = normInv(1 - significanceLevel) + Math.sqrt(2 * 3); // df=3
    const ncp = -Math.log(1 - power) * 2 + criticalValue;
    const w = Math.sqrt(ncp / sampleSize);
    
    return w;
  }
  
  // For linear regression
  if (test === "linear-regression") {
    const u = 3; // Number of predictors
    const lambda = -Math.log(2 * (1 - power)) / 0.2 + 2.8; // Solve for lambda
    const f2 = lambda / (sampleSize - u - 1);
    
    return f2;
  }
  
  return null;
}

export function calculateSignificanceLevel(params: PowerParameters): number | null {
  const { test, sampleSize, effectSize, power } = params;
  
  if (sampleSize === null || effectSize === null || power === null) return null;
  
  // This is a very simplified approximation for all tests
  // In practice, solving for alpha is more complex
  
  // For t-tests
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const df = test === "ttest-one-sample" ? sampleSize - 1 : 
              test === "ttest-paired" ? sampleSize - 1 : 
              2 * sampleSize - 2;
    
    const ncp = effectSize * Math.sqrt(sampleSize);
    const t_power = tInv(power, df) + ncp;
    
    // Approximate alpha from the critical t
    const alpha = 2 * (1 - tCDF(t_power, df));
    
    return Math.min(Math.max(0.001, alpha), 0.999); // Keep in reasonable range
  }
  
  // For other tests - very rough approximation
  // In practice, these would require numerical methods to solve
  const zb = normInv(power);
  const standardizedEffect = effectSize * Math.sqrt(sampleSize);
  const za = standardizedEffect - zb;
  
  const alpha = 2 * (1 - normCDF(za));
  
  return Math.min(Math.max(0.001, alpha), 0.999); // Keep in reasonable range
}

export function generatePowerCurve(
  params: PowerParameters,
  sampleSizes: number[]
): { sampleSize: number; power: number }[] {
  const results: { sampleSize: number; power: number }[] = [];
  
  for (const n of sampleSizes) {
    const calculationParams: PowerParameters = {
      ...params,
      sampleSize: n
    };
    
    const powerValue = calculatePower(calculationParams);
    
    if (powerValue !== null) {
      results.push({
        sampleSize: n,
        power: powerValue
      });
    }
  }
  
  return results;
}

export function generateEffectSizeCurve(
  params: PowerParameters,
  effectSizes: number[]
): { effectSize: number; power: number }[] {
  const results: { effectSize: number; power: number }[] = [];
  
  for (const es of effectSizes) {
    const calculationParams: PowerParameters = {
      ...params,
      effectSize: es
    };
    
    const powerValue = calculatePower(calculationParams);
    
    if (powerValue !== null) {
      results.push({
        effectSize: es,
        power: powerValue
      });
    }
  }
  
  return results;
}
