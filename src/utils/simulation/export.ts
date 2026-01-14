/**
 * Export utilities for simulation results
 */

import type { SimulationResult, SimulationConfig } from '@/types/simulation-power';

/**
 * Export results to CSV format
 */
export function exportToCSV(results: SimulationResult[]): string {
  const headers = [
    'Sample Size',
    'Domain Shift (MMD)',
    'Estimated Power',
    'CI Lower',
    'CI Upper',
    'Mean Metric',
    'SD Metric',
    'Num Simulations'
  ].join(',');
  
  const rows = results.map(r => [
    r.sampleSize,
    r.domainShift.toFixed(4),
    r.successRate.toFixed(4),
    r.confidenceInterval.lower.toFixed(4),
    r.confidenceInterval.upper.toFixed(4),
    r.meanMetric.toFixed(4),
    r.stdMetric.toFixed(4),
    r.simulations.length
  ].join(','));
  
  return [headers, ...rows].join('\n');
}

/**
 * Export results to JSON with full config for reproducibility
 */
export function exportToJSON(results: SimulationResult[], config: SimulationConfig): string {
  return JSON.stringify({
    config,
    results: results.map(r => ({
      ...r,
      simulations: r.simulations // Include all individual simulation results
    })),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }, null, 2);
}

/**
 * Generate R code to reproduce analysis
 */
export function generateRCode(config: SimulationConfig): string {
  return `# SOCR Simulation-Based Power Analysis - R Reproduction Code
# Generated: ${new Date().toISOString()}

library(MASS)
library(pROC)

# Configuration
set.seed(${config.randomSeed || 42})
n_simulations <- ${config.numSimulations}
sample_sizes <- seq(${config.sampleSizeRange.min}, ${config.sampleSizeRange.max}, by = ${config.sampleSizeRange.step})
domain_shifts <- seq(${config.domainShiftRange.min}, ${config.domainShiftRange.max}, length.out = ${config.domainShiftRange.steps + 1})
success_threshold <- ${config.successCriterion.threshold}
n_features <- ${config.dataGeneration.numFeatures}

# Data generation function
generate_transfer_data <- function(n_source, n_target, domain_shift) {
  # Source data
  source_X <- mvrnorm(n_source, mu = rep(0, n_features), 
                       Sigma = diag(n_features) * (1 - ${config.dataGeneration.featureCorrelation}) + 
                               matrix(${config.dataGeneration.featureCorrelation}, n_features, n_features))
  
  # Target data with shift
  shift_direction <- rnorm(n_features)
  shift_direction <- shift_direction / sqrt(sum(shift_direction^2))
  target_mean <- shift_direction * domain_shift
  
  target_X <- mvrnorm(n_target, mu = target_mean, 
                       Sigma = diag(n_features) * (1 - ${config.dataGeneration.featureCorrelation}) + 
                               matrix(${config.dataGeneration.featureCorrelation}, n_features, n_features))
  
  # Generate labels
  true_coef <- rnorm(n_features)
  true_coef <- true_coef / sqrt(sum(true_coef^2))
  
  source_prob <- plogis(source_X %*% true_coef)
  target_prob <- plogis(target_X %*% true_coef * (1 - domain_shift * 0.3))
  
  source_Y <- rbinom(n_source, 1, source_prob)
  target_Y <- rbinom(n_target, 1, target_prob)
  
  list(source_X = source_X, source_Y = source_Y, 
       target_X = target_X, target_Y = target_Y)
}

# Run simulation
results <- expand.grid(sample_size = sample_sizes, domain_shift = domain_shifts)
results$power <- NA
results$mean_auc <- NA

for (i in 1:nrow(results)) {
  n <- results$sample_size[i]
  shift <- results$domain_shift[i]
  
  aucs <- replicate(n_simulations, {
    data <- generate_transfer_data(n, n, shift)
    model <- glm(source_Y ~ ., data = data.frame(source_Y = data$source_Y, data$source_X), 
                 family = binomial)
    pred <- predict(model, newdata = data.frame(data$target_X), type = "response")
    auc(data$target_Y, pred, quiet = TRUE)
  })
  
  results$power[i] <- mean(aucs > success_threshold)
  results$mean_auc[i] <- mean(aucs)
  
  cat(sprintf("n=%d, shift=%.2f: Power=%.3f, Mean AUC=%.3f\\n", 
              n, shift, results$power[i], results$mean_auc[i]))
}

# Plot results
library(ggplot2)
ggplot(results, aes(x = sample_size, y = power, color = factor(domain_shift))) +
  geom_line() +
  geom_point() +
  labs(title = "Simulation-Based Power Analysis",
       x = "Sample Size", y = "Estimated Power",
       color = "Domain Shift (MMD)") +
  theme_minimal()
`;
}

/**
 * Generate Python code to reproduce analysis
 */
export function generatePythonCode(config: SimulationConfig): string {
  return `# SOCR Simulation-Based Power Analysis - Python Reproduction Code
# Generated: ${new Date().toISOString()}

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal

# Configuration
np.random.seed(${config.randomSeed || 42})
n_simulations = ${config.numSimulations}
sample_sizes = np.arange(${config.sampleSizeRange.min}, ${config.sampleSizeRange.max} + 1, ${config.sampleSizeRange.step})
domain_shifts = np.linspace(${config.domainShiftRange.min}, ${config.domainShiftRange.max}, ${config.domainShiftRange.steps + 1})
success_threshold = ${config.successCriterion.threshold}
n_features = ${config.dataGeneration.numFeatures}
correlation = ${config.dataGeneration.featureCorrelation}

def generate_corr_matrix(n, rho):
    """Generate correlation matrix with constant off-diagonal correlation."""
    return np.eye(n) * (1 - rho) + np.ones((n, n)) * rho

def generate_transfer_data(n_source, n_target, domain_shift):
    """Generate transfer learning dataset."""
    cov = generate_corr_matrix(n_features, correlation)
    
    # Source data
    source_X = np.random.multivariate_normal(np.zeros(n_features), cov, n_source)
    
    # Target data with shift
    shift_direction = np.random.randn(n_features)
    shift_direction /= np.linalg.norm(shift_direction)
    target_mean = shift_direction * domain_shift
    target_X = np.random.multivariate_normal(target_mean, cov, n_target)
    
    # Generate labels
    true_coef = np.random.randn(n_features)
    true_coef /= np.linalg.norm(true_coef)
    
    def sigmoid(x):
        return 1 / (1 + np.exp(-np.clip(x, -20, 20)))
    
    source_prob = sigmoid(source_X @ true_coef)
    target_prob = sigmoid(target_X @ true_coef * (1 - domain_shift * 0.3))
    
    source_Y = np.random.binomial(1, source_prob)
    target_Y = np.random.binomial(1, target_prob)
    
    return source_X, source_Y, target_X, target_Y

# Run simulation
results = []

for n in sample_sizes:
    for shift in domain_shifts:
        aucs = []
        for _ in range(n_simulations):
            source_X, source_Y, target_X, target_Y = generate_transfer_data(n, n, shift)
            
            # Handle edge cases
            if len(np.unique(source_Y)) < 2 or len(np.unique(target_Y)) < 2:
                aucs.append(0.5)
                continue
            
            model = LogisticRegression(max_iter=100, solver='lbfgs')
            model.fit(source_X, source_Y)
            pred = model.predict_proba(target_X)[:, 1]
            aucs.append(roc_auc_score(target_Y, pred))
        
        power = np.mean(np.array(aucs) > success_threshold)
        mean_auc = np.mean(aucs)
        results.append({
            'sample_size': n,
            'domain_shift': shift,
            'power': power,
            'mean_auc': mean_auc
        })
        print(f"n={n}, shift={shift:.2f}: Power={power:.3f}, Mean AUC={mean_auc:.3f}")

# Convert to DataFrame
df = pd.DataFrame(results)

# Plot
fig, ax = plt.subplots(figsize=(10, 6))
for shift in domain_shifts:
    subset = df[df['domain_shift'] == shift]
    ax.plot(subset['sample_size'], subset['power'], 
            label=f'MMD={shift:.2f}', marker='o')

ax.set_xlabel('Sample Size')
ax.set_ylabel('Estimated Power')
ax.set_title('Simulation-Based Power Analysis: Cross-Species Transfer Learning')
ax.legend(title='Domain Shift')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('power_analysis.png', dpi=150)
plt.show()
`;
}

/**
 * Download content as file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
