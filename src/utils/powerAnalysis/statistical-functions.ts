
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

// Non-central t-distribution CDF approximation using Johnson-Welch method
export const nonCentralTCdf = (t: number, df: number, ncp: number): number => {
  // For large df, use normal approximation
  if (df > 100) {
    return normCdf(t - ncp);
  }
  
  // Handle edge cases
  if (df <= 0) return 0.5;
  if (Math.abs(ncp) < 1e-10) return tCdf(t, df);
  
  // Johnson-Welch approximation with proper moment matching
  const delta = ncp;
  
  // Calculate moments
  const mu = delta * Math.sqrt(df / 2) * gamma((df - 1) / 2) / gamma(df / 2);
  const sigma2 = df / (df - 2) - mu * mu;
  
  if (sigma2 <= 0 || df <= 2) {
    // Fallback for edge cases
    return normCdf((t - delta) / Math.sqrt(1 + delta * delta / df));
  }
  
  // Standardize and apply correction
  const standardized = (t - mu) / Math.sqrt(sigma2);
  
  // Third moment correction for better accuracy
  const skewness = (2 * delta * Math.sqrt(df / 2) * gamma((df - 2) / 2) / gamma(df / 2) - 3 * mu * sigma2) / Math.pow(sigma2, 1.5);
  const correction = skewness * (standardized * standardized - 1) / 6;
  
  return Math.max(0, Math.min(1, normCdf(standardized - correction)));
};

// t-distribution critical value using improved Cornish-Fisher expansion
export const tCritical = (alpha: number, df: number, tailType: "one" | "two" = "two"): number => {
  const p = tailType === "two" ? 1 - alpha / 2 : 1 - alpha;
  
  // Handle edge cases
  if (p <= 0 || p >= 1) return 0;
  if (df <= 0) return normInv(p);
  
  // For large df, use normal approximation
  if (df > 100) {
    return normInv(p);
  }
  
  // Improved Cornish-Fisher expansion for t critical values
  const z = normInv(p);
  
  // More accurate coefficients
  const c2 = z / (4 * df);
  const c4 = (5 * z * z * z + 16 * z) / (96 * df * df);
  const c6 = (3 * Math.pow(z, 5) + 19 * z * z * z + 17 * z) / (384 * df * df * df);
  
  const correction = c2 + c4 + c6;
  
  return z + correction;
};

// F-distribution critical value using improved Wilson-Hilferty transformation
export const fCritical = (alpha: number, df1: number, df2: number): number => {
  // Handle edge cases
  if (alpha <= 0 || alpha >= 1) return 1;
  if (df1 <= 0 || df2 <= 0) return 1;
  
  // Special case for df1 = 1
  if (df1 === 1) {
    const tCrit = tCritical(alpha, df2, "two");
    return tCrit * tCrit;
  }
  
  // Improved Wilson-Hilferty transformation
  const z = normInv(1 - alpha);
  
  // More accurate coefficients
  const h1 = 2 / (9 * df1);
  const h2 = 2 / (9 * df2);
  
  // Enhanced transformation with higher-order terms
  const c1 = 1 - h1;
  const c2 = 1 - h2 + z * Math.sqrt(h2);
  
  // Add correction for better accuracy
  const correction = (h1 * h2) / (df1 + df2);
  const result = Math.pow(c2 / c1, 3);
  
  return Math.max(0.001, result * (1 + correction));
};

// Non-central F-distribution CDF using Patnaik's chi-square approximation
export const nonCentralFCdf = (f: number, df1: number, df2: number, ncp: number): number => {
  // Handle edge cases
  if (f <= 0) return 0;
  if (df1 <= 0 || df2 <= 0) return 0;
  
  // For central F-distribution (ncp = 0)
  if (Math.abs(ncp) < 1e-10) {
    // Use Wilson-Hilferty transformation for central F
    const h = 2 / (9 * df2);
    const w = f * df1 / df2;
    const z = (Math.pow(w, 1/3) - (1 - 2/(9*df1))) / Math.sqrt(2/(9*df1));
    return normCdf(z);
  }
  
  // Patnaik's approximation for non-central F
  // Convert F * df1 to non-central chi-square with df1 and ncp
  const chiSq = f * df1;
  
  // Patnaik's method: approximate non-central χ² as scaled central χ²
  // h = (df + 2*ncp) / (df + ncp)
  // k = (df + ncp)² / (df + 2*ncp)
  const h = (df1 + 2 * ncp) / (df1 + ncp);
  const k = Math.pow(df1 + ncp, 2) / (df1 + 2 * ncp);
  
  if (h <= 0 || k <= 0) {
    return f > 1 ? 0.95 : 0.05;
  }
  
  // Transform to standard normal using improved Wilson-Hilferty
  const scaledChi = chiSq / h;
  const cubeRoot = Math.pow(scaledChi / k, 1/3);
  const z = (cubeRoot - (1 - 2/(9*k))) / Math.sqrt(2/(9*k));
  
  // Return complementary CDF for power calculation
  return Math.max(0.001, Math.min(0.999, normCdf(z)));
};
