/**
 * Hook for running simulation-based power analysis
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  SimulationConfig, 
  SimulationProgress, 
  SimulationResult,
  SingleSimulationResult 
} from '@/types/simulation-power';
import { MersenneTwister } from '@/utils/simulation/random';
import { wilsonScoreInterval } from '@/utils/simulation/distributions';
import { generateTransferLearningData } from '@/utils/simulation/transfer-learning-generator';
import { evaluateTransferPerformance } from '@/utils/simulation/model-fitting';

export function useSimulation() {
  const [progress, setProgress] = useState<SimulationProgress | null>(null);
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const runningRef = useRef(false);

  const startSimulation = useCallback(async (config: SimulationConfig) => {
    if (runningRef.current) return;
    
    runningRef.current = true;
    cancelledRef.current = false;
    setError(null);
    setResults(null);
    
    const rng = new MersenneTwister(config.randomSeed);
    const allResults: SimulationResult[] = [];
    
    // Calculate total iterations
    const sampleSizes: number[] = [];
    for (let n = config.sampleSizeRange.min; n <= config.sampleSizeRange.max; n += config.sampleSizeRange.step) {
      sampleSizes.push(n);
    }
    
    const domainShifts: number[] = [];
    const shiftStep = (config.domainShiftRange.max - config.domainShiftRange.min) / config.domainShiftRange.steps;
    for (let i = 0; i <= config.domainShiftRange.steps; i++) {
      domainShifts.push(config.domainShiftRange.min + i * shiftStep);
    }
    
    const totalIterations = sampleSizes.length * domainShifts.length * config.numSimulations;
    let currentIteration = 0;
    const startTime = Date.now();
    
    setProgress({
      currentIteration: 0,
      totalIterations,
      currentSampleSize: sampleSizes[0],
      currentDomainShift: domainShifts[0],
      estimatedTimeRemaining: 0,
      status: 'running',
      partialResults: [],
      startTime
    });
    
    try {
      for (const n of sampleSizes) {
        if (cancelledRef.current) break;
        
        for (const shift of domainShifts) {
          if (cancelledRef.current) break;
          
          const simResults: SingleSimulationResult[] = [];
          
          for (let sim = 0; sim < config.numSimulations; sim++) {
            if (cancelledRef.current) break;
            
            try {
              const data = generateTransferLearningData(
                rng,
                config.dataGeneration,
                n,
                n,
                shift
              );
              
              const metricType = config.successCriterion.metric === 'custom' ? 'auc' : config.successCriterion.metric;
              const metrics = evaluateTransferPerformance(data, metricType);
              const metricValue = metrics[config.successCriterion.metric];
              
              const success = config.successCriterion.direction === 'greater'
                ? metricValue > config.successCriterion.threshold
                : metricValue < config.successCriterion.threshold;
              
              simResults.push({
                iteration: sim,
                metric: metricValue,
                success,
                trainSize: n,
                testSize: n
              });
            } catch (e) {
              // If a single simulation fails, record it as unsuccessful
              simResults.push({
                iteration: sim,
                metric: 0.5,
                success: false,
                trainSize: n,
                testSize: n
              });
            }
            
            currentIteration++;
            
            // Update progress every 10 iterations
            if (currentIteration % 10 === 0) {
              const elapsed = Date.now() - startTime;
              const rate = currentIteration / elapsed;
              const remaining = (totalIterations - currentIteration) / rate;
              
              setProgress({
                currentIteration,
                totalIterations,
                currentSampleSize: n,
                currentDomainShift: shift,
                estimatedTimeRemaining: remaining / 1000,
                status: 'running',
                partialResults: [...allResults],
                startTime
              });
              
              // Yield to UI thread
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
          
          // Aggregate results for this (n, shift) combination
          const successCount = simResults.filter(r => r.success).length;
          const successRate = successCount / simResults.length;
          const metrics = simResults.map(r => r.metric);
          const meanMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length;
          const variance = metrics.reduce((sum, m) => sum + (m - meanMetric) ** 2, 0) / metrics.length;
          const stdMetric = Math.sqrt(variance);
          
          const ci = wilsonScoreInterval(successRate, config.numSimulations, 0.95);
          
          allResults.push({
            sampleSize: n,
            domainShift: shift,
            successRate,
            confidenceInterval: ci,
            meanMetric,
            stdMetric,
            simulations: simResults
          });
        }
      }
      
      if (!cancelledRef.current) {
        setResults(allResults);
        setProgress(prev => prev ? { ...prev, status: 'completed', partialResults: allResults } : null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed');
      setProgress(prev => prev ? { ...prev, status: 'error' } : null);
    } finally {
      runningRef.current = false;
    }
  }, []);

  const cancelSimulation = useCallback(() => {
    cancelledRef.current = true;
    setProgress(prev => prev ? { ...prev, status: 'cancelled' } : null);
    runningRef.current = false;
  }, []);

  const resetSimulation = useCallback(() => {
    cancelledRef.current = true;
    setProgress(null);
    setResults(null);
    setError(null);
    runningRef.current = false;
  }, []);

  return { 
    startSimulation, 
    cancelSimulation, 
    resetSimulation,
    progress, 
    results, 
    error,
    isRunning: progress?.status === 'running'
  };
}
