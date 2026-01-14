/**
 * Simulation Progress Component
 * Shows real-time progress during simulation
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, XCircle, Clock, Zap } from 'lucide-react';
import type { SimulationProgress as SimulationProgressType } from '@/types/simulation-power';

interface SimulationProgressProps {
  progress: SimulationProgressType;
  onCancel: () => void;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function SimulationProgress({ progress, onCancel }: SimulationProgressProps) {
  const percentComplete = (progress.currentIteration / progress.totalIterations) * 100;
  const elapsed = progress.startTime ? (Date.now() - progress.startTime) / 1000 : 0;
  const rate = elapsed > 0 ? progress.currentIteration / elapsed : 0;

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="py-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-medium">Simulation Running...</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-destructive hover:text-destructive">
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{percentComplete.toFixed(1)}%</span>
            </div>
            <Progress value={percentComplete} className="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-muted-foreground text-xs">Current Sample Size</div>
              <div className="font-semibold text-lg">{progress.currentSampleSize}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-muted-foreground text-xs">Domain Shift (MMD)</div>
              <div className="font-semibold text-lg">{progress.currentDomainShift.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="h-3 w-3" />
                Time Remaining
              </div>
              <div className="font-semibold text-lg">{formatTime(progress.estimatedTimeRemaining)}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Zap className="h-3 w-3" />
                Speed
              </div>
              <div className="font-semibold text-lg">{rate.toFixed(0)}/s</div>
            </div>
          </div>

          {/* Iteration Count */}
          <div className="text-center text-sm text-muted-foreground">
            {progress.currentIteration.toLocaleString()} / {progress.totalIterations.toLocaleString()} iterations
          </div>

          {/* Partial Results Preview */}
          {progress.partialResults.length > 0 && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-muted-foreground mb-2">Latest Result</div>
              <div className="text-sm">
                n = {progress.partialResults[progress.partialResults.length - 1].sampleSize}, 
                MMD = {progress.partialResults[progress.partialResults.length - 1].domainShift.toFixed(2)} →{' '}
                <span className="font-semibold text-blue-600">
                  Power = {(progress.partialResults[progress.partialResults.length - 1].successRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
