
import React from "react";
import { Input } from "@/components/ui/input";
import { SliderWithLabels } from "@/components/ui/slider-with-labels";
import { InfoTooltip } from "@/components/InfoTooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PowerParameters } from "@/types/power-analysis";
import { EFFECT_SIZE_MAP } from "@/utils/powerAnalysis";

interface PowerControlsProps {
  targetParameter: keyof Omit<PowerParameters, "test">;
  params: PowerParameters;
  handleParameterChange: (name: keyof Omit<PowerParameters, "test">, value: number | string) => void;
  showControl: (controlName: keyof Omit<PowerParameters, "test">) => boolean;
}

export function PowerControls({ 
  targetParameter, 
  params, 
  handleParameterChange,
  showControl
}: PowerControlsProps) {
  const getEffectSizeLabel = () => {
    return EFFECT_SIZE_MAP[params.test].label;
  };

  return (
    <div className="space-y-4">
      {showControl("sampleSize") && targetParameter !== "sampleSize" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Sample Size
            <InfoTooltip content="The number of observations or participants in your study. Larger samples provide more statistical power." />
          </label>
          <div className="flex space-x-2">
            <Input 
              type="number" 
              min="2" 
              max="1000" 
              value={params.sampleSize || ""} 
              onChange={(e) => handleParameterChange("sampleSize", Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {showControl("effectSize") && targetParameter !== "effectSize" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Effect Size ({getEffectSizeLabel()})
            <InfoTooltip content="The magnitude of the effect you're trying to detect. Values can be considered small, medium, or large according to Cohen's conventions." />
          </label>
          <div className="space-y-2">
            <SliderWithLabels
              value={[params.effectSize || 0]}
              min={0}
              max={Math.max(2, EFFECT_SIZE_MAP[params.test].large * 2.5)}
              step={0.01}
              onValueChange={(value) => handleParameterChange("effectSize", value[0])}
              labels={[
                { value: 0, label: '0' },
                { value: EFFECT_SIZE_MAP[params.test].small, label: `Small (${EFFECT_SIZE_MAP[params.test].small})`, highlight: true },
                { value: EFFECT_SIZE_MAP[params.test].medium, label: `Medium (${EFFECT_SIZE_MAP[params.test].medium})`, highlight: true },
                { value: EFFECT_SIZE_MAP[params.test].large, label: `Large (${EFFECT_SIZE_MAP[params.test].large})`, highlight: true }
              ]}
              formatValue={(val) => val.toFixed(2)}
            />
            <Input 
              type="number" 
              min="0" 
              max="2" 
              step="0.01" 
              value={params.effectSize?.toFixed(2) || ""} 
              onChange={(e) => handleParameterChange("effectSize", Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {showControl("significanceLevel") && targetParameter !== "significanceLevel" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Significance Level (α)
            <InfoTooltip content="The probability of rejecting the null hypothesis when it is true (Type I error). Commonly set at 0.05 (5%)." />
          </label>
          <div className="space-y-2">
            <SliderWithLabels
              value={[params.significanceLevel || 0.05]}
              min={0.001}
              max={0.1}
              step={0.001}
              onValueChange={(value) => handleParameterChange("significanceLevel", value[0])}
              labels={[
                { value: 0.001, label: '0.001' },
                { value: 0.01, label: '0.01' },
                { value: 0.05, label: '0.05', highlight: true },
                { value: 0.1, label: '0.10' }
              ]}
              formatValue={(val) => val.toFixed(3)}
            />
            <Input 
              type="number" 
              min="0.001" 
              max="0.1" 
              step="0.001" 
              value={params.significanceLevel?.toFixed(3) || ""} 
              onChange={(e) => handleParameterChange("significanceLevel", Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {showControl("power") && targetParameter !== "power" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Power (1-β)
            <InfoTooltip content="The probability of detecting a true effect (sensitivity). Equals 1 minus the probability of a Type II error. A value of 0.8 (80%) is commonly used." />
          </label>
          <div className="space-y-2">
            <SliderWithLabels
              value={[params.power || 0]}
              min={0.5}
              max={0.999}
              step={0.001}
              onValueChange={(value) => handleParameterChange("power", value[0])}
              labels={[
                { value: 0.5, label: '0.50' },
                { value: 0.8, label: '0.80', highlight: true },
                { value: 0.95, label: '0.95' },
                { value: 0.99, label: '0.99' }
              ]}
              formatValue={(val) => val.toFixed(3)}
            />
            <Input 
              type="number" 
              min="0.5" 
              max="0.999" 
              step="0.001" 
              value={params.power?.toFixed(3) || ""} 
              onChange={(e) => handleParameterChange("power", Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
