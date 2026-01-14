/**
 * Simulation Configuration Panel
 * Allows users to configure all simulation parameters
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Play, Settings2 } from 'lucide-react';
import type { SimulationConfig, DataGenerationConfig } from '@/types/simulation-power';
import { defaultSimulationConfig } from '@/types/simulation-power';
import { InfoTooltip } from '@/components/InfoTooltip';

interface SimulationConfigPanelProps {
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
  onStartSimulation: () => void;
  disabled?: boolean;
}

export function SimulationConfigPanel({
  config,
  onConfigChange,
  onStartSimulation,
  disabled = false
}: SimulationConfigPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateConfig = (updates: Partial<SimulationConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const updateDataGeneration = (updates: Partial<DataGenerationConfig>) => {
    onConfigChange({
      ...config,
      dataGeneration: { ...config.dataGeneration, ...updates }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Simulation Configuration
        </CardTitle>
        <CardDescription>
          Configure Monte Carlo simulation parameters for transfer learning power analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Study Design */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Study Design
            <InfoTooltip content="Select the type of simulation study to run" />
          </Label>
          <Select
            value={config.studyDesign}
            onValueChange={(value: any) => updateConfig({ studyDesign: value })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transfer-learning">Cross-Species Transfer Learning</SelectItem>
              <SelectItem value="bootstrap">Bootstrap Resampling</SelectItem>
              <SelectItem value="permutation">Permutation Test</SelectItem>
              <SelectItem value="custom">Custom Simulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sample Size Range */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            Sample Size Range
            <InfoTooltip content="Range of sample sizes to evaluate. Power will be estimated for each size." />
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Minimum</Label>
              <Input
                type="number"
                min={10}
                max={config.sampleSizeRange.max - config.sampleSizeRange.step}
                value={config.sampleSizeRange.min}
                onChange={(e) => updateConfig({
                  sampleSizeRange: { ...config.sampleSizeRange, min: parseInt(e.target.value) || 10 }
                })}
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Maximum</Label>
              <Input
                type="number"
                min={config.sampleSizeRange.min + config.sampleSizeRange.step}
                max={2000}
                value={config.sampleSizeRange.max}
                onChange={(e) => updateConfig({
                  sampleSizeRange: { ...config.sampleSizeRange, max: parseInt(e.target.value) || 500 }
                })}
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Step</Label>
              <Input
                type="number"
                min={10}
                max={100}
                value={config.sampleSizeRange.step}
                onChange={(e) => updateConfig({
                  sampleSizeRange: { ...config.sampleSizeRange, step: parseInt(e.target.value) || 50 }
                })}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Domain Shift (MMD) Range */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            Domain Shift Range (MMD)
            <InfoTooltip content="Maximum Mean Discrepancy between source (e.g., mice) and target (e.g., humans) distributions. Higher values = greater species difference." />
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Min MMD</Label>
              <Input
                type="number"
                min={0}
                max={config.domainShiftRange.max - 0.1}
                step={0.1}
                value={config.domainShiftRange.min}
                onChange={(e) => updateConfig({
                  domainShiftRange: { ...config.domainShiftRange, min: parseFloat(e.target.value) || 0 }
                })}
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max MMD</Label>
              <Input
                type="number"
                min={config.domainShiftRange.min + 0.1}
                max={3}
                step={0.1}
                value={config.domainShiftRange.max}
                onChange={(e) => updateConfig({
                  domainShiftRange: { ...config.domainShiftRange, max: parseFloat(e.target.value) || 1.5 }
                })}
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Steps</Label>
              <Input
                type="number"
                min={2}
                max={10}
                value={config.domainShiftRange.steps}
                onChange={(e) => updateConfig({
                  domainShiftRange: { ...config.domainShiftRange, steps: parseInt(e.target.value) || 5 }
                })}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Low (Same Distribution)</span>
            <span>High (Very Different)</span>
          </div>
        </div>

        {/* Success Criterion */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            Success Criterion
            <InfoTooltip content="Define what constitutes a 'successful' simulation. Power = proportion of simulations meeting this criterion." />
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Metric</Label>
              <Select
                value={config.successCriterion.metric}
                onValueChange={(value: any) => updateConfig({
                  successCriterion: { ...config.successCriterion, metric: value }
                })}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auc">AUC-ROC</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="f1">F1 Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <Select
                value={config.successCriterion.direction}
                onValueChange={(value: any) => updateConfig({
                  successCriterion: { ...config.successCriterion, direction: value }
                })}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Greater than</SelectItem>
                  <SelectItem value="less">Less than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Threshold</Label>
              <Input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={config.successCriterion.threshold}
                onChange={(e) => updateConfig({
                  successCriterion: { ...config.successCriterion, threshold: parseFloat(e.target.value) || 0.6 }
                })}
                disabled={disabled}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Power = P({config.successCriterion.metric.toUpperCase()} {config.successCriterion.direction === 'greater' ? '>' : '<'} {config.successCriterion.threshold})
          </p>
        </div>

        {/* Monte Carlo Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Simulations per Point
              <InfoTooltip content="Number of Monte Carlo iterations for each (sample size, domain shift) combination. More = higher accuracy but slower." />
            </Label>
            <Input
              type="number"
              min={100}
              max={10000}
              step={100}
              value={config.numSimulations}
              onChange={(e) => updateConfig({ numSimulations: parseInt(e.target.value) || 500 })}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Random Seed
              <InfoTooltip content="Set a seed for reproducible results. Leave empty for random." />
            </Label>
            <Input
              type="number"
              placeholder="Optional (for reproducibility)"
              value={config.randomSeed || ''}
              onChange={(e) => updateConfig({ randomSeed: e.target.value ? parseInt(e.target.value) : undefined })}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Advanced: Data Generation */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" disabled={disabled}>
              <span>Advanced: Data Generation Settings</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Features</Label>
                <Input
                  type="number"
                  min={2}
                  max={50}
                  value={config.dataGeneration.numFeatures}
                  onChange={(e) => updateDataGeneration({ numFeatures: parseInt(e.target.value) || 10 })}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label>Feature Correlation</Label>
                <Input
                  type="number"
                  min={0}
                  max={0.9}
                  step={0.1}
                  value={config.dataGeneration.featureCorrelation}
                  onChange={(e) => updateDataGeneration({ featureCorrelation: parseFloat(e.target.value) || 0.3 })}
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Prevalence (mice)</Label>
                <Input
                  type="number"
                  min={0.05}
                  max={0.95}
                  step={0.05}
                  value={config.dataGeneration.sourcePrevalence}
                  onChange={(e) => updateDataGeneration({ sourcePrevalence: parseFloat(e.target.value) || 0.3 })}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Prevalence (humans)</Label>
                <Input
                  type="number"
                  min={0.05}
                  max={0.95}
                  step={0.05}
                  value={config.dataGeneration.targetPrevalence}
                  onChange={(e) => updateDataGeneration({ targetPrevalence: parseFloat(e.target.value) || 0.3 })}
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Shared Variance
                  <InfoTooltip content="Proportion of signal that transfers between species. Higher = better transfer potential." />
                </Label>
                <Slider
                  min={0.1}
                  max={0.9}
                  step={0.1}
                  value={[config.dataGeneration.sharedVariance]}
                  onValueChange={([v]) => updateDataGeneration({ sharedVariance: v })}
                  disabled={disabled}
                />
                <div className="text-xs text-center text-muted-foreground">
                  {(config.dataGeneration.sharedVariance * 100).toFixed(0)}%
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Species-Specific Noise
                  <InfoTooltip content="Amount of noise unique to each species. Higher = harder transfer." />
                </Label>
                <Slider
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  value={[config.dataGeneration.speciesSpecificNoise]}
                  onValueChange={([v]) => updateDataGeneration({ speciesSpecificNoise: v })}
                  disabled={disabled}
                />
                <div className="text-xs text-center text-muted-foreground">
                  {(config.dataGeneration.speciesSpecificNoise * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigChange(defaultSimulationConfig)}
              disabled={disabled}
            >
              Reset to Defaults
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Estimated Runtime */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated iterations:</span>
            <span className="font-medium">
              {(() => {
                const numSampleSizes = Math.floor((config.sampleSizeRange.max - config.sampleSizeRange.min) / config.sampleSizeRange.step) + 1;
                const numShifts = config.domainShiftRange.steps + 1;
                return (numSampleSizes * numShifts * config.numSimulations).toLocaleString();
              })()}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Approximate runtime:</span>
            <span className="font-medium">
              {(() => {
                const numSampleSizes = Math.floor((config.sampleSizeRange.max - config.sampleSizeRange.min) / config.sampleSizeRange.step) + 1;
                const numShifts = config.domainShiftRange.steps + 1;
                const totalIter = numSampleSizes * numShifts * config.numSimulations;
                const seconds = totalIter * 0.005; // Rough estimate
                if (seconds < 60) return `~${Math.ceil(seconds)} seconds`;
                return `~${Math.ceil(seconds / 60)} minutes`;
              })()}
            </span>
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStartSimulation}
          disabled={disabled}
          className="w-full"
          size="lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
}
