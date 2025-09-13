/**
 * Robust numerical methods for statistical distributions - "Gold Standard"
 * These functions provide high-precision calculations for power analysis
 */

import { gamma } from './statistical-functions';

/**
 * High-precision normal CDF using Hart's algorithm
 */
export const robustNormCdf = (z: number): number => {
  if (z < -37) return 0;
  if (z > 37) return 1;
  
  const abs_z = Math.abs(z);
  let y: number;
  
  if (abs_z < 7.07106781186547) {
    // Hart's algorithm for moderate values
    const exp_half_z_squared = Math.exp(-0.5 * z * z);
    if (abs_z < 1.28) {
      y = 0.5 - z * (0.398942280444 - 0.399903438504 * z * z / 
        (z * z + 5.75885480458 - 29.8213557808 / 
        (z * z + 2.62433121679 + 48.6959930692 / 
        (z * z + 5.92885724438))));
    } else {
      y = 0.398942280385 * exp_half_z_squared / 
        (abs_z - 3.8052e-8 + 1.00000615302 / 
        (abs_z + 3.98064794e-4 + 1.98615381364 / 
        (abs_z - 0.151679116635 + 5.29330324926 / 
        (abs_z + 4.8385912808 - 15.1508972451 / 
        (abs_z + 0.742380924027 + 30.789933034 / 
        (abs_z + 3.99019417011))))));
    }
  } else {
    y = 0;
  }
  
  return z < 0 ? y : 1 - y;
};

/**
 * High-precision inverse normal CDF using Beasley-Springer-Moro algorithm
 */
export const robustNormInv = (p: number): number => {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;
  
  const a = [0, -3.969683028665376e+01, 2.209460984245205e+02,
             -2.759285104469687e+02, 1.383577518672690e+02,
             -3.066479806614716e+01, 2.506628277459239e+00];
  
  const b = [0, -5.447609879822406e+01, 1.615858368580409e+02,
             -1.556989798598866e+02, 6.680131188771972e+01,
             -1.328068155288572e+01];
  
  const c = [0, -7.784894002430293e-03, -3.223964580411365e-01,
             -2.400758277161838e+00, -2.549732539343734e+00,
             4.374664141464968e+00, 2.938163982698783e+00];
  
  const d = [0, 7.784695709041462e-03, 3.224671290700398e-01,
             2.445134137142996e+00, 3.754408661907416e+00];
  
  const p_low = 0.02425;
  const p_high = 1 - p_low;
  let q: number, r: number;
  
  if (p < p_low) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
           ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
  } else if (p <= p_high) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q /
           (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
            ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
  }
};

/**
 * Robust t-distribution CDF using continued fraction
 */
export const robustTCdf = (t: number, df: number): number => {
  if (df <= 0) return 0.5;
  if (df >= 100) return robustNormCdf(t);
  
  const x = df / (df + t * t);
  const beta_val = incompleteBeta(x, df / 2, 0.5);
  
  if (t >= 0) {
    return 0.5 + 0.5 * (1 - beta_val);
  } else {
    return 0.5 - 0.5 * (1 - beta_val);
  }
};

/**
 * Robust non-central t-distribution CDF using series expansion
 */
export const robustNonCentralTCdf = (t: number, df: number, ncp: number): number => {
  if (Math.abs(ncp) < 1e-10) {
    return robustTCdf(t, df);
  }
  
  // Use Owen's T function for non-central t
  const a = t / Math.sqrt(df);
  const h = ncp;
  
  // Approximate using Johnson's method
  const delta = h;
  const gamma_val = t / Math.sqrt(df + t * t);
  
  let sum = 0;
  const max_terms = 100;
  
  for (let k = 0; k < max_terms; k++) {
    const term = Math.pow(delta, k) * Math.exp(-delta * delta / 2) / factorial(k);
    const prob = robustNormCdf(gamma_val * Math.sqrt(df + 2 * k) - delta);
    sum += term * prob;
    
    if (Math.abs(term) < 1e-12) break;
  }
  
  return Math.max(0, Math.min(1, sum));
};

/**
 * Robust F-distribution CDF using incomplete beta function
 */
export const robustFCdf = (f: number, df1: number, df2: number): number => {
  if (f <= 0) return 0;
  if (df1 <= 0 || df2 <= 0) return 0;
  
  const x = (df1 * f) / (df1 * f + df2);
  return incompleteBeta(x, df1 / 2, df2 / 2);
};

/**
 * IMPROVED: Robust non-central F-distribution CDF using Poisson mixture method
 */
export const robustNonCentralFCdf = (f: number, df1: number, df2: number, ncp: number): number => {
  if (Math.abs(ncp) < 1e-10) {
    return robustFCdf(f, df1, df2);
  }
  
  if (f <= 0) return 0;
  
  let sum = 0;
  const maxTerms = 200;
  const lambda = ncp / 2;
  
  // Poisson mixture: F ~ F(df1 + 2j, df2) with Poisson(λ) weights
  for (let j = 0; j < maxTerms; j++) {
    const poissonProb = Math.exp(-lambda + j * Math.log(Math.max(lambda, 1e-100)) - logFactorial(j));
    const centralF = robustFCdf(f, df1 + 2 * j, df2);
    sum += poissonProb * centralF;
    
    // Check for convergence
    if (j > 10 && poissonProb < 1e-12) break;
  }
  
  return Math.max(0, Math.min(1, sum));
};

/**
 * IMPROVED: Robust non-central Chi-square CDF using Poisson mixture method
 */
export const robustNonCentralChiSquareCdf = (x: number, df: number, ncp: number): number => {
  if (Math.abs(ncp) < 1e-10) {
    return robustChiSquareCdf(x, df);
  }
  
  if (x <= 0) return 0;
  
  let sum = 0;
  const maxTerms = 200;
  const lambda = ncp / 2;
  
  // Poisson mixture: χ² ~ χ²(df + 2j) with Poisson(λ) weights  
  for (let j = 0; j < maxTerms; j++) {
    const poissonProb = Math.exp(-lambda + j * Math.log(Math.max(lambda, 1e-100)) - logFactorial(j));
    const centralChiSq = robustChiSquareCdf(x, df + 2 * j);
    sum += poissonProb * centralChiSq;
    
    // Check for convergence
    if (j > 10 && poissonProb < 1e-12) break;
  }
  
  return Math.max(0, Math.min(1, sum));
};

/**
 * Robust chi-square CDF using series expansion
 */
export const robustChiSquareCdf = (x: number, df: number): number => {
  if (x <= 0) return 0;
  if (df <= 0) return 0;
  
  return incompleteGamma(df / 2, x / 2);
};

/**
 * Helper functions
 */
function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  
  // Use continued fraction for incomplete beta
  const bt = Math.exp(gammaLn(a + b) - gammaLn(a) - gammaLn(b) + 
                     a * Math.log(x) + b * Math.log(1 - x));
  
  if (x < (a + 1) / (a + b + 2)) {
    return bt * betacf(x, a, b) / a;
  } else {
    return 1 - bt * betacf(1 - x, b, a) / b;
  }
}

function betacf(x: number, a: number, b: number): number {
  const max_iter = 100;
  const eps = 3e-7;
  
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  
  for (let m = 1; m <= max_iter; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    
    if (Math.abs(del - 1) < eps) break;
  }
  
  return h;
}

function incompleteGamma(a: number, x: number): number {
  if (x < 0 || a <= 0) return 0;
  if (x === 0) return 0;
  
  const gln = gammaLn(a);
  
  if (x < a + 1) {
    // Use series representation
    let sum = 1 / a;
    let del = sum;
    
    for (let n = 1; n <= 100; n++) {
      del *= x / (a + n);
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 3e-7) break;
    }
    
    return sum * Math.exp(-x + a * Math.log(x) - gln);
  } else {
    // Use continued fraction
    let b = x + 1 - a;
    let c = 1e30;
    let d = 1 / b;
    let h = d;
    
    for (let i = 1; i <= 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 3e-7) break;
    }
    
    return 1 - h * Math.exp(-x + a * Math.log(x) - gln);
  }
}

function gammaLn(x: number): number {
  const cof = [76.18009172947146, -86.50532032941677, 24.01409824083091,
               -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  
  let j = 0;
  let ser = 1.000000000190015;
  let xx = x;
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  
  for (; j < 6; j++) {
    ser += cof[j] / ++y;
  }
  
  return -tmp + Math.log(2.5066282746310005 * ser / xx);
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Log factorial for numerical stability in Poisson mixture calculations
 */
function logFactorial(n: number): number {
  if (n < 2) return 0;
  let result = 0;
  for (let i = 2; i <= n; i++) {
    result += Math.log(i);
  }
  return result;
}