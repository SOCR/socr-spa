// Simulation-Based Power Analysis Types

export type StudyDesignType = "transfer-learning" | "bootstrap" | "permutation" | "custom";
export type DistributionType = "normal" | "lognormal" | "mixture";
export type SuccessMetric = "auc" | "accuracy" | "f1" | "custom";

export interface DistributionParams {
  type: DistributionType;
  mean: number;
  variance: number;
  mixtureProportion?: number;
}

export interface DataGenerationConfig {
  // Source domain (e.g., mice)
  sourceDistribution: DistributionParams;
  sourcePrevalence: number; // Proportion of positive class
  
  // Target domain (e.g., humans)
  targetDistribution: DistributionParams;
  targetPrevalence: number;
  
  // Feature structure
  numFeatures: number;
  featureCorrelation: number; // Within-domain correlation
  
  // Cross-species structure
  sharedVariance: number; // Proportion of shared signal
  speciesSpecificNoise: number;
}

export interface SuccessCriterion {
  metric: SuccessMetric;
  threshold: number; // e.g., 0.60 for AUC > 0.60
  direction: "greater" | "less";
}

export interface SimulationConfig {
  // Study design
  studyDesign: StudyDesignType;
  
  // Sample parameters
  sampleSizeRange: { min: number; max: number; step: number };
  
  // Domain shift parameters (for transfer learning)
  domainShiftRange: { min: number; max: number; steps: number };
  
  // Success criteria
  successCriterion: SuccessCriterion;
  
  // Simulation parameters
  numSimulations: number; // Monte Carlo iterations (e.g., 500)
  randomSeed?: number; // For reproducibility
  
  // Data generation parameters
  dataGeneration: DataGenerationConfig;
}

export interface SingleSimulationResult {
  iteration: number;
  metric: number; // e.g., AUC value
  success: boolean; // metric > threshold
  trainSize: number;
  testSize: number;
}

export interface SimulationResult {
  sampleSize: number;
  domainShift: number;
  successRate: number; // Estimated power
  confidenceInterval: { lower: number; upper: number };
  meanMetric: number; // Mean AUC across simulations
  stdMetric: number; // SD of metric
  simulations: SingleSimulationResult[];
}

export interface SimulationProgress {
  currentIteration: number;
  totalIterations: number;
  currentSampleSize: number;
  currentDomainShift: number;
  estimatedTimeRemaining: number; // seconds
  status: "idle" | "running" | "completed" | "error" | "cancelled";
  partialResults: SimulationResult[];
  startTime?: number;
}

export interface SimulationWorkerMessage {
  type: "progress" | "complete" | "error";
  progress?: SimulationProgress;
  results?: SimulationResult[];
  error?: string;
}

// Default configuration
export const defaultSimulationConfig: SimulationConfig = {
  studyDesign: "transfer-learning",
  sampleSizeRange: { min: 50, max: 500, step: 50 },
  domainShiftRange: { min: 0.1, max: 1.5, steps: 5 },
  successCriterion: {
    metric: "auc",
    threshold: 0.60,
    direction: "greater"
  },
  numSimulations: 500,
  randomSeed: 42,
  dataGeneration: {
    sourceDistribution: { type: "normal", mean: 0, variance: 1 },
    sourcePrevalence: 0.3,
    targetDistribution: { type: "normal", mean: 0, variance: 1 },
    targetPrevalence: 0.3,
    numFeatures: 10,
    featureCorrelation: 0.3,
    sharedVariance: 0.6,
    speciesSpecificNoise: 0.2
  }
};
