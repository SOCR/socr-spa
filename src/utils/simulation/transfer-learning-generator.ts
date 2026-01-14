/**
 * Transfer Learning Data Generator
 * Generates synthetic data with controlled cross-species structure
 */

import { MersenneTwister, sampleNormal, sampleBernoulli, sampleStandardNormal } from './random';
import { sampleCorrelatedFeatures, mean } from './distributions';
import type { DataGenerationConfig } from '@/types/simulation-power';

export interface TransferLearningData {
  sourceX: number[][]; // Source features (e.g., mice)
  sourceY: number[]; // Source labels
  targetX: number[][]; // Target features (e.g., humans)
  targetY: number[]; // Target labels
  trueMMD: number; // Actual domain shift
}

/**
 * Generate data for transfer learning simulation
 * 
 * The model:
 * 1. Generate shared latent signal (what transfers between species)
 * 2. Add species-specific variation controlled by domainShift (MMD)
 * 3. Generate binary outcomes based on latent signal + noise
 */
export function generateTransferLearningData(
  rng: MersenneTwister,
  config: DataGenerationConfig,
  sourceSampleSize: number,
  targetSampleSize: number,
  domainShift: number // MMD magnitude (0 = same distribution, higher = more different)
): TransferLearningData {
  const { numFeatures, featureCorrelation, sharedVariance, speciesSpecificNoise } = config;
  const { sourcePrevalence, targetPrevalence } = config;
  
  // Generate source domain data
  const sourceMean = Array(numFeatures).fill(0);
  const sourceX = sampleCorrelatedFeatures(rng, sourceSampleSize, numFeatures, sourceMean, featureCorrelation);
  
  // Generate target domain data with domain shift
  // Domain shift is modeled as a mean shift in feature space
  const shiftDirection = generateRandomDirection(rng, numFeatures);
  const targetMean = shiftDirection.map(d => d * domainShift);
  const targetX = sampleCorrelatedFeatures(rng, targetSampleSize, numFeatures, targetMean, featureCorrelation);
  
  // Generate latent signal (shared across species)
  const trueCoefficients = generateRandomDirection(rng, numFeatures);
  
  // Generate labels based on latent signal
  const sourceY = generateLabels(rng, sourceX, trueCoefficients, sharedVariance, speciesSpecificNoise, sourcePrevalence);
  
  // For target, use same coefficients but with domain-specific adjustment
  const targetAdjustment = 1 - domainShift * 0.3; // Reduce signal strength with domain shift
  const adjustedCoefficients = trueCoefficients.map(c => c * targetAdjustment);
  const targetY = generateLabels(rng, targetX, adjustedCoefficients, sharedVariance, speciesSpecificNoise, targetPrevalence);
  
  // Calculate actual MMD between source and target
  const trueMMD = calculateMMD(sourceX, targetX);
  
  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
    trueMMD
  };
}

/**
 * Generate random unit direction vector
 */
function generateRandomDirection(rng: MersenneTwister, n: number): number[] {
  const direction = [];
  for (let i = 0; i < n; i++) {
    direction.push(sampleStandardNormal(rng));
  }
  // Normalize
  const norm = Math.sqrt(direction.reduce((sum, x) => sum + x * x, 0));
  return direction.map(d => d / norm);
}

/**
 * Generate binary labels based on latent signal
 */
function generateLabels(
  rng: MersenneTwister,
  X: number[][],
  coefficients: number[],
  sharedVariance: number,
  noise: number,
  targetPrevalence: number
): number[] {
  const n = X.length;
  const labels: number[] = [];
  
  for (let i = 0; i < n; i++) {
    // Linear combination of features
    let linearComb = 0;
    for (let j = 0; j < coefficients.length; j++) {
      linearComb += X[i][j] * coefficients[j];
    }
    
    // Add noise
    linearComb = linearComb * Math.sqrt(sharedVariance) + sampleNormal(rng, 0, noise);
    
    // Convert to probability using logistic function
    // Adjust intercept to achieve target prevalence
    const intercept = logit(targetPrevalence);
    const probability = sigmoid(linearComb + intercept);
    
    labels.push(sampleBernoulli(rng, probability));
  }
  
  return labels;
}

/**
 * Sigmoid function
 */
function sigmoid(x: number): number {
  if (x > 20) return 1;
  if (x < -20) return 0;
  return 1 / (1 + Math.exp(-x));
}

/**
 * Logit function (inverse sigmoid)
 */
function logit(p: number): number {
  p = Math.max(0.001, Math.min(0.999, p));
  return Math.log(p / (1 - p));
}

/**
 * Calculate Maximum Mean Discrepancy (MMD) between two distributions
 * Using Gaussian kernel
 */
export function calculateMMD(
  source: number[][],
  target: number[][],
  kernelBandwidth?: number
): number {
  const n = source.length;
  const m = target.length;
  
  if (n === 0 || m === 0) return 0;
  
  // Estimate bandwidth using median heuristic if not provided
  const bandwidth = kernelBandwidth ?? estimateKernelBandwidth(source, target);
  
  // Calculate MMD^2 = E[k(x,x')] + E[k(y,y')] - 2E[k(x,y)]
  let sumXX = 0;
  let sumYY = 0;
  let sumXY = 0;
  
  // k(x, x')
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      sumXX += gaussianKernel(source[i], source[j], bandwidth);
    }
  }
  sumXX = 2 * sumXX / (n * (n - 1) || 1);
  
  // k(y, y')
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      sumYY += gaussianKernel(target[i], target[j], bandwidth);
    }
  }
  sumYY = 2 * sumYY / (m * (m - 1) || 1);
  
  // k(x, y)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      sumXY += gaussianKernel(source[i], target[j], bandwidth);
    }
  }
  sumXY = sumXY / (n * m);
  
  const mmd2 = sumXX + sumYY - 2 * sumXY;
  return Math.sqrt(Math.max(0, mmd2));
}

/**
 * Gaussian (RBF) kernel
 */
function gaussianKernel(x: number[], y: number[], bandwidth: number): number {
  let squaredDist = 0;
  for (let i = 0; i < x.length; i++) {
    squaredDist += (x[i] - y[i]) ** 2;
  }
  return Math.exp(-squaredDist / (2 * bandwidth * bandwidth));
}

/**
 * Estimate kernel bandwidth using median heuristic
 */
function estimateKernelBandwidth(source: number[][], target: number[][]): number {
  const combined = [...source.slice(0, 50), ...target.slice(0, 50)]; // Sample for efficiency
  const distances: number[] = [];
  
  for (let i = 0; i < combined.length; i++) {
    for (let j = i + 1; j < combined.length; j++) {
      let dist = 0;
      for (let k = 0; k < combined[i].length; k++) {
        dist += (combined[i][k] - combined[j][k]) ** 2;
      }
      distances.push(Math.sqrt(dist));
    }
  }
  
  distances.sort((a, b) => a - b);
  return distances[Math.floor(distances.length / 2)] || 1;
}
