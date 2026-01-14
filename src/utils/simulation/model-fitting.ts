/**
 * Lightweight model fitting utilities for simulation
 * Implements logistic regression and AUC calculation
 */

import type { TransferLearningData } from './transfer-learning-generator';

/**
 * Logistic regression model
 */
export interface LogisticRegressionModel {
  weights: number[];
  bias: number;
}

/**
 * Fit logistic regression using gradient descent
 */
export function fitLogisticRegression(
  X: number[][],
  y: number[],
  learningRate: number = 0.1,
  maxIterations: number = 100,
  regularization: number = 0.01
): LogisticRegressionModel {
  const n = X.length;
  const numFeatures = X[0]?.length || 0;
  
  if (n === 0) {
    return { weights: Array(numFeatures).fill(0), bias: 0 };
  }
  
  // Initialize weights
  let weights = Array(numFeatures).fill(0);
  let bias = 0;
  
  // Gradient descent
  for (let iter = 0; iter < maxIterations; iter++) {
    // Calculate predictions
    const predictions = X.map((xi, i) => {
      let z = bias;
      for (let j = 0; j < numFeatures; j++) {
        z += weights[j] * xi[j];
      }
      return sigmoid(z);
    });
    
    // Calculate gradients
    const gradWeights = Array(numFeatures).fill(0);
    let gradBias = 0;
    
    for (let i = 0; i < n; i++) {
      const error = predictions[i] - y[i];
      gradBias += error;
      for (let j = 0; j < numFeatures; j++) {
        gradWeights[j] += error * X[i][j] + regularization * weights[j];
      }
    }
    
    // Update weights
    bias -= learningRate * gradBias / n;
    for (let j = 0; j < numFeatures; j++) {
      weights[j] -= learningRate * gradWeights[j] / n;
    }
  }
  
  return { weights, bias };
}

/**
 * Predict probabilities using logistic regression model
 */
export function predictProbabilities(
  X: number[][],
  model: LogisticRegressionModel
): number[] {
  return X.map(xi => {
    let z = model.bias;
    for (let j = 0; j < model.weights.length; j++) {
      z += model.weights[j] * xi[j];
    }
    return sigmoid(z);
  });
}

/**
 * Calculate AUC-ROC
 * Uses the Wilcoxon-Mann-Whitney statistic
 */
export function calculateAUC(yTrue: number[], yPred: number[]): number {
  const n = yTrue.length;
  if (n === 0) return 0.5;
  
  // Separate positive and negative examples
  const positives: number[] = [];
  const negatives: number[] = [];
  
  for (let i = 0; i < n; i++) {
    if (yTrue[i] === 1) {
      positives.push(yPred[i]);
    } else {
      negatives.push(yPred[i]);
    }
  }
  
  const nPos = positives.length;
  const nNeg = negatives.length;
  
  if (nPos === 0 || nNeg === 0) return 0.5;
  
  // Count pairs where positive > negative
  let concordant = 0;
  let ties = 0;
  
  for (const pos of positives) {
    for (const neg of negatives) {
      if (pos > neg) {
        concordant++;
      } else if (pos === neg) {
        ties += 0.5;
      }
    }
  }
  
  return (concordant + ties) / (nPos * nNeg);
}

/**
 * Calculate accuracy
 */
export function calculateAccuracy(yTrue: number[], yPred: number[], threshold: number = 0.5): number {
  const n = yTrue.length;
  if (n === 0) return 0;
  
  let correct = 0;
  for (let i = 0; i < n; i++) {
    const predicted = yPred[i] >= threshold ? 1 : 0;
    if (predicted === yTrue[i]) correct++;
  }
  
  return correct / n;
}

/**
 * Calculate F1 score
 */
export function calculateF1(yTrue: number[], yPred: number[], threshold: number = 0.5): number {
  let tp = 0, fp = 0, fn = 0;
  
  for (let i = 0; i < yTrue.length; i++) {
    const predicted = yPred[i] >= threshold ? 1 : 0;
    if (predicted === 1 && yTrue[i] === 1) tp++;
    else if (predicted === 1 && yTrue[i] === 0) fp++;
    else if (predicted === 0 && yTrue[i] === 1) fn++;
  }
  
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  
  return precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;
}

/**
 * Evaluate transfer learning performance
 * Train on source, evaluate on target
 */
export function evaluateTransferPerformance(
  data: TransferLearningData,
  metric: 'auc' | 'accuracy' | 'f1' = 'auc'
): { auc: number; accuracy: number; f1: number } {
  // Train logistic regression on source data
  const model = fitLogisticRegression(data.sourceX, data.sourceY);
  
  // Predict on target data
  const targetPredictions = predictProbabilities(data.targetX, model);
  
  // Calculate metrics
  const auc = calculateAUC(data.targetY, targetPredictions);
  const accuracy = calculateAccuracy(data.targetY, targetPredictions);
  const f1 = calculateF1(data.targetY, targetPredictions);
  
  return { auc, accuracy, f1 };
}

/**
 * Sigmoid function
 */
function sigmoid(x: number): number {
  if (x > 20) return 1;
  if (x < -20) return 0;
  return 1 / (1 + Math.exp(-x));
}
