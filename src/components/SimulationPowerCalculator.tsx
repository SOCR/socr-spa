/**
 * Main Simulation Power Calculator Component
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices, RotateCcw } from 'lucide-react';
import type { SimulationConfig } from '@/types/simulation-power';
import { defaultSimulationConfig } from '@/types/simulation-power';
import { useSimulation } from '@/hooks/useSimulation';
import {
  SimulationConfigPanel,
  SimulationProgress,
  SimulationResults,
  SimulationMethodology
} from '@/components/simulation';

export function SimulationPowerCalculator() {
  const [config, setConfig] = useState<SimulationConfig>(defaultSimulationConfig);
  const { startSimulation, cancelSimulation, resetSimulation, progress, results, error, isRunning } = useSimulation();

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dices className="h-6 w-6" />
            Simulation-Based Power Analysis
          </CardTitle>
          <CardDescription>
            Monte Carlo simulation for cross-species transfer learning and other complex scenarios without analytical solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Configuration Panel - hide when running */}
          {!isRunning && !results && (
            <SimulationConfigPanel
              config={config}
              onConfigChange={setConfig}
              onStartSimulation={() => startSimulation(config)}
              disabled={isRunning}
            />
          )}

          {/* Progress Display */}
          {isRunning && progress && (
            <SimulationProgress
              progress={progress}
              onCancel={cancelSimulation}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-destructive">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results */}
          {results && (
            <>
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Simulation
                </Button>
              </div>
              <SimulationResults results={results} config={config} />
            </>
          )}

          {/* Methodology Documentation */}
          <SimulationMethodology />
        </CardContent>
      </Card>
    </div>
  );
}
