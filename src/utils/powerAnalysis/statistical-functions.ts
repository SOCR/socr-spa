
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
export const normCdf = (z: number): number => {
  // Approximation of the standard normal CDF
  if (z < -8.0) return 0.0;
  if (z > 8.0) return 1.0;
  
  let sum = 0.0;
  let term = z;
  let i = 3;
  
  while (Math.abs(term) > 1e-10) {
    sum += term;
    term = term * z * z / i;
    i += 2;
  }
  
  return 0.5 + sum * Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
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
  // Approximation for t distribution CDF
  const a = df / 2;
  const b = 0.5;
  const x = a / (a + t * t / 2);
  
  // Incomplete beta function approximation
  if (x < 0 || x > 1) return 0;
  
  const beta = Math.exp(
    Math.log(x) * a + 
    Math.log(1 - x) * b - 
    Math.log(a + b) + 
    Math.log(gamma(a + b)) - 
    Math.log(gamma(a)) - 
    Math.log(gamma(b))
  );
  
  return t > 0 ? 1 - 0.5 * beta : 0.5 * beta;
};

// Non-central t-distribution CDF approximation
export const nonCentralTCdf = (t: number, df: number, ncp: number): number => {
  // Approximation based on normal distribution for large df
  if (df > 100) {
    return normCdf(t - ncp);
  }
  
  // For smaller df, use a more accurate approximation
  // This is a simplified approximation
  const adjustment = ncp * ncp / (2 * df);
  const adjustedT = t - ncp;
  
  return tCdf(adjustedT, df);
};

// F-distribution critical value approximation
export const fCritical = (alpha: number, df1: number, df2: number): number => {
  // Approximation for F critical value
  if (df1 === 1) {
    const tCrit = normInv(1 - alpha / 2) * Math.sqrt(df2 / (df2 - 2));
    return tCrit * tCrit;
  }
  
  // General case approximation
  const logAlpha = Math.log(alpha);
  const a = 1 / (df1 - 1);
  const b = 1 / (df2 - 1);
  const c = a + b;
  const d = a - b;
  
  const p = 2 / c * (1 + d * d / 3 + d * d * d * d / 5);
  const y = Math.pow(-logAlpha / p, 2 / df1);
  
  return y / (1 - b * y);
};

// Non-central F-distribution CDF approximation
export const nonCentralFCdf = (f: number, df1: number, df2: number, ncp: number): number => {
  // Simplified approximation for non-central F CDF
  // This is a complex function, here we use a practical approximation
  
  if (ncp < 1) {
    // For small non-centrality parameters
    return 1 - Math.exp(-(f - 1) * ncp / 2);
  }
  
  // For larger non-centrality parameters
  const lambda = ncp;
  const sqrtF = Math.sqrt(f);
  const sqrtLambda = Math.sqrt(lambda);
  
  // Approx using normal CDF
  return normCdf((sqrtF - sqrtLambda) * Math.sqrt(df2 / df1));
};
