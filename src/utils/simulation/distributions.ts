/**
 * Statistical distribution utilities for simulation
 */

import { MersenneTwister, sampleNormal, sampleStandardNormal } from './random';

/**
 * Cholesky decomposition for positive definite matrix
 * Returns lower triangular matrix L such that A = L * L^T
 */
export function choleskyDecomposition(matrix: number[][]): number[][] {
  const n = matrix.length;
  const L: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      
      if (j === i) {
        for (let k = 0; k < j; k++) {
          sum += L[j][k] * L[j][k];
        }
        L[j][j] = Math.sqrt(Math.max(0, matrix[j][j] - sum));
      } else {
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }
        L[i][j] = L[j][j] !== 0 ? (matrix[i][j] - sum) / L[j][j] : 0;
      }
    }
  }
  
  return L;
}

/**
 * Generate correlation matrix with constant correlation
 */
export function generateCorrelationMatrix(n: number, correlation: number): number[][] {
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(correlation));
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1;
  }
  return matrix;
}

/**
 * Sample from multivariate normal distribution
 */
export function sampleMultivariateNormal(
  rng: MersenneTwister,
  mean: number[],
  covarianceMatrix: number[][]
): number[] {
  const n = mean.length;
  const L = choleskyDecomposition(covarianceMatrix);
  
  // Generate standard normal samples
  const z: number[] = [];
  for (let i = 0; i < n; i++) {
    z.push(sampleStandardNormal(rng));
  }
  
  // Transform: x = mean + L * z
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = mean[i];
    for (let j = 0; j <= i; j++) {
      sum += L[i][j] * z[j];
    }
    result.push(sum);
  }
  
  return result;
}

/**
 * Sample multiple observations from multivariate normal
 */
export function sampleCorrelatedFeatures(
  rng: MersenneTwister,
  numSamples: number,
  numFeatures: number,
  mean: number[],
  correlation: number
): number[][] {
  const corrMatrix = generateCorrelationMatrix(numFeatures, correlation);
  
  const samples: number[][] = [];
  for (let i = 0; i < numSamples; i++) {
    samples.push(sampleMultivariateNormal(rng, mean, corrMatrix));
  }
  
  return samples;
}

/**
 * Sample from lognormal distribution
 */
export function sampleLogNormal(rng: MersenneTwister, mu: number, sigma: number): number {
  return Math.exp(sampleNormal(rng, mu, sigma));
}

/**
 * Sample from mixture of two normals
 */
export function sampleMixtureNormal(
  rng: MersenneTwister,
  mean1: number,
  std1: number,
  mean2: number,
  std2: number,
  mixtureProp: number
): number {
  if (rng.random() < mixtureProp) {
    return sampleNormal(rng, mean1, std1);
  }
  return sampleNormal(rng, mean2, std2);
}

/**
 * Calculate sample mean
 */
export function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculate sample standard deviation
 */
export function std(arr: number[]): number {
  const m = mean(arr);
  const squaredDiffs = arr.map(x => (x - m) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

/**
 * Calculate variance
 */
export function variance(arr: number[]): number {
  const m = mean(arr);
  return arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length;
}

/**
 * Wilson score interval for proportion confidence interval
 * More accurate than normal approximation for small samples or extreme proportions
 */
export function wilsonScoreInterval(
  successRate: number,
  n: number,
  confidence: number = 0.95
): { lower: number; upper: number } {
  // z-score for confidence level
  const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645;
  
  const denominator = 1 + z * z / n;
  const centre = successRate + z * z / (2 * n);
  const margin = z * Math.sqrt((successRate * (1 - successRate) + z * z / (4 * n)) / n);
  
  return {
    lower: Math.max(0, (centre - margin) / denominator),
    upper: Math.min(1, (centre + margin) / denominator)
  };
}
