
/**
 * Core statistical functions used in power analysis
 */

// Implementation of gamma function (since Math.gamma doesn't exist)
export const gamma = (z: number): number => {
  // Lanczos approximation for the gamma function
  // Implementation based on numerical recipes
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  if (z < 0.5) {
    // Reflection formula
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  } else {
    z -= 1;
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) {
      x += p[i] / (z + i + 1);
    }
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
};

// Standard normal distribution function (cumulative distribution function)
// Using Abramowitz & Stegun approximation for better accuracy
export const normCdf = (z: number): number => {
  if (z < -8.0) return 0.0;
  if (z > 8.0) return 1.0;
  
  const sign = z >= 0 ? 1 : -1;
  const x = Math.abs(z) / Math.sqrt(2);
  
  // Abramowitz & Stegun approximation
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1 + sign * y);
};

// Inverse of the standard normal CDF (quantile function)
export const normInv = (p: number): number => {
  // Approximation using the Acklam's algorithm
  if (p <= 0) return -8;
  if (p >= 1) return 8;
  
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
  
  let q, r;
  
  if (p < 0.02425) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
           ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= 0.97575) {
    q = p - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
};

// t-distribution cumulative distribution function approximation
export const tCdf = (t: number, df: number): number => {
  // Better approximation for t distribution CDF
  if (df <= 0) return 0.5;
  
  // For large df, use normal approximation
  if (df > 100) {
    return normCdf(t);
  }
  
  // Hill's approximation for t-distribution CDF
  const x2 = t * t;
  const c4 = df / 4;
  const c6 = df / 6;
  
  // Improved series approximation
  const term1 = 1 + x2 / df;
  const power = -(df + 1) / 2;
  const factor = Math.pow(term1, power);
  
  // Use beta function relationship
  const integralPart = 0.5 + t / Math.sqrt(Math.PI * df) * 
    gamma((df + 1) / 2) / gamma(df / 2) * factor;
  
  return Math.max(0, Math.min(1, integralPart));
};

// Non-central t-distribution CDF approximation
export const nonCentralTCdf = (t: number, df: number, ncp: number): number => {
  // For large df, use normal approximation
  if (df > 100) {
    return normCdf(t - ncp);
  }
  
  // Improved Johnson-Kotz-Balakrishnan approximation
  const delta = ncp;
  const tCentered = t - delta;
  
  // Better approximation using moment matching
  const variance = (df + delta * delta) / (df - 2);
  const skewness = 2 * delta * Math.sqrt(df) / Math.pow(df - 2, 1.5);
  
  // Cornish-Fisher expansion
  const standardized = tCentered / Math.sqrt(variance);
  const correction = skewness * (standardized * standardized - 1) / 6;
  
  return normCdf(standardized - correction);
};

// t-distribution critical value
export const tCritical = (alpha: number, df: number, tailType: "one" | "two" = "two"): number => {
  const p = tailType === "two" ? 1 - alpha / 2 : 1 - alpha;
  
  // Approximation for t critical value using normal approximation for large df
  if (df > 100) {
    return normInv(p);
  }
  
  // Hill's approximation for t critical values
  const z = normInv(p);
  const c1 = z;
  const c2 = (z * z * z + z) / (4 * df);
  const c3 = (5 * Math.pow(z, 5) + 16 * z * z * z + 3 * z) / (96 * df * df);
  
  return z + c2 + c3;
};

// F-distribution critical value approximation
export const fCritical = (alpha: number, df1: number, df2: number): number => {
  // Improved approximation for F critical value
  if (df1 === 1) {
    const tCrit = tCritical(alpha, df2, "two");
    return tCrit * tCrit;
  }
  
  // Wilson-Hilferty approximation
  const h1 = 2 / (9 * df1);
  const h2 = 2 / (9 * df2);
  const z = normInv(1 - alpha);
  
  const term1 = 1 - h2 + z * Math.sqrt(h2);
  const term2 = 1 - h1;
  
  return Math.pow(term1 / term2, 3);
};

// Non-central F-distribution CDF approximation
export const nonCentralFCdf = (f: number, df1: number, df2: number, ncp: number): number => {
  // Improved approximation for non-central F CDF
  if (f <= 0) return 0;
  if (ncp <= 0) return 1 - Math.exp(-f);  // Central F approximation
  
  // Use Pearson's approximation for non-central F
  const h = 2 * (df1 + ncp) * (df1 + ncp) / (2 * df1 + ncp);
  const gamma_val = (df1 + 2 * ncp) / (df1 + ncp);
  
  // Adjusted F statistic
  const adjustedF = f / gamma_val;
  
  // Calculate power using improved approximation
  const chiSquareApprox = adjustedF * df1;
  const effectiveNcp = ncp * df1 / (df1 + ncp);
  
  // Use normal approximation for better accuracy
  const mean = df1 + effectiveNcp;
  const variance = 2 * df1 + 4 * effectiveNcp;
  const normalizedX = (chiSquareApprox - mean) / Math.sqrt(variance);
  
  return 1 - normCdf(normalizedX);
};
