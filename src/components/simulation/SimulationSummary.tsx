/**
 * Simulation Summary Statistics
 */

import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SimulationResult, SimulationConfig } from '@/types/simulation-power';

interface SimulationSummaryProps {
  results: SimulationResult[];
  config: SimulationConfig;
}

export function SimulationSummary({ results, config }: SimulationSummaryProps) {
  // Find minimum sample size for 80% power at each domain shift
  const getMinSampleFor80Power = (shift: number) => {
    const shiftResults = results
      .filter(r => Math.abs(r.domainShift - shift) < 0.01)
      .sort((a, b) => a.sampleSize - b.sampleSize);
    
    for (const r of shiftResults) {
      if (r.successRate >= 0.80) return r.sampleSize;
    }
    return null;
  };

  // Get unique shifts and sample sizes
  const shifts = [...new Set(results.map(r => r.domainShift))].sort((a, b) => a - b);
  const sampleSizes = [...new Set(results.map(r => r.sampleSize))].sort((a, b) => a - b);

  // Summary stats
  const avgPower = results.reduce((sum, r) => sum + r.successRate, 0) / results.length;
  const maxPower = Math.max(...results.map(r => r.successRate));
  const minPower = Math.min(...results.map(r => r.successRate));
  
  // Find best configuration (highest power)
  const bestResult = results.reduce((best, r) => r.successRate > best.successRate ? r : best, results[0]);
  
  // Find configurations achieving 80% power
  const achieves80 = results.filter(r => r.successRate >= 0.80);
  const minSampleFor80 = achieves80.length > 0 
    ? Math.min(...achieves80.map(r => r.sampleSize)) 
    : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Target className="h-4 w-4" />
            Best Power
          </div>
          <div className="text-2xl font-bold text-green-600">
            {(maxPower * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            n={bestResult.sampleSize}, MMD={bestResult.domainShift.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TrendingUp className="h-4 w-4" />
            Average Power
          </div>
          <div className="text-2xl font-bold">
            {(avgPower * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Across all configurations
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            {minSampleFor80 ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            Min n for 80% Power
          </div>
          <div className="text-2xl font-bold">
            {minSampleFor80 ? minSampleFor80 : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {minSampleFor80 
              ? `${achieves80.length} configs achieve 80%` 
              : 'Not achieved in range'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Worst Case
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {(minPower * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {results.find(r => r.successRate === minPower)?.domainShift.toFixed(2)} MMD
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
