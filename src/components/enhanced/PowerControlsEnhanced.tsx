import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SliderWithLabels, SliderLabel } from "@/components/ui/slider-with-labels";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PowerParameters } from "@/types/power-analysis";
import { EFFECT_SIZE_MAP } from "@/utils/powerAnalysis";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface PowerControlsEnhancedProps {
  targetParameter: keyof Omit<PowerParameters, "test">;
  params: PowerParameters;
  handleParameterChange: (name: keyof Omit<PowerParameters, "test">, value: number | string) => void;
  showControl: (controlName: keyof Omit<PowerParameters, "test">) => boolean;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  level: 'error' | 'warning' | 'info';
}

export function PowerControlsEnhanced({ 
  targetParameter, 
  params, 
  handleParameterChange,
  showControl
}: PowerControlsEnhancedProps) {
  const [validationMessages, setValidationMessages] = useState<Record<string, ValidationResult>>({});

  // Enhanced validation functions
  const validateSampleSize = (value: number | null): ValidationResult => {
    if (!value || value < 4) {
      return { isValid: false, message: "Sample size must be at least 4", level: 'error' };
    }
    if (value > 10000) {
      return { isValid: false, message: "Sample size seems unusually large. Consider practical constraints.", level: 'warning' };
    }
    if (value < 20) {
      return { isValid: true, message: "Small sample size may have limited power", level: 'warning' };
    }
    if (value > 1000) {
      return { isValid: true, message: "Large sample size provides high power but may detect trivial effects", level: 'info' };
    }
    return { isValid: true, message: "Sample size is appropriate", level: 'info' };
  };

  const validateEffectSize = (value: number | null, testType: string): ValidationResult => {
    if (!value || value <= 0) {
      return { isValid: false, message: "Effect size must be greater than 0", level: 'error' };
    }
    
    const effectSizeConfig = EFFECT_SIZE_MAP[testType];
    if (!effectSizeConfig) {
      return { isValid: true, message: "Effect size validation not available for this test", level: 'info' };
    }

    if (value < effectSizeConfig.small * 0.5) {
      return { isValid: true, message: "Very small effect - may require large sample sizes", level: 'warning' };
    }
    if (value > effectSizeConfig.large * 2) {
      return { isValid: true, message: "Very large effect - verify this is realistic", level: 'warning' };
    }
    if (value >= effectSizeConfig.small && value < effectSizeConfig.medium) {
      return { isValid: true, message: "Small effect size (Cohen's conventions)", level: 'info' };
    }
    if (value >= effectSizeConfig.medium && value < effectSizeConfig.large) {
      return { isValid: true, message: "Medium effect size (Cohen's conventions)", level: 'info' };
    }
    if (value >= effectSizeConfig.large) {
      return { isValid: true, message: "Large effect size (Cohen's conventions)", level: 'info' };
    }
    return { isValid: true, message: "Effect size is appropriate", level: 'info' };
  };

  const validateSignificanceLevel = (value: number | null): ValidationResult => {
    if (!value || value <= 0 || value >= 1) {
      return { isValid: false, message: "Significance level must be between 0 and 1", level: 'error' };
    }
    if (value > 0.1) {
      return { isValid: true, message: "High significance level increases Type I error risk", level: 'warning' };
    }
    if (value < 0.001) {
      return { isValid: true, message: "Very strict significance level may reduce power", level: 'warning' };
    }
    if (value === 0.05) {
      return { isValid: true, message: "Standard significance level (α = 0.05)", level: 'info' };
    }
    return { isValid: true, message: "Significance level is appropriate", level: 'info' };
  };

  const validatePower = (value: number | null): ValidationResult => {
    if (!value || value <= 0 || value >= 1) {
      return { isValid: false, message: "Power must be between 0 and 1", level: 'error' };
    }
    if (value < 0.5) {
      return { isValid: true, message: "Low power increases risk of missing true effects", level: 'warning' };
    }
    if (value < 0.8) {
      return { isValid: true, message: "Power below conventional threshold (0.8)", level: 'warning' };
    }
    if (value >= 0.8 && value < 0.9) {
      return { isValid: true, message: "Good power (Cohen's convention)", level: 'info' };
    }
    if (value >= 0.9) {
      return { isValid: true, message: "High power - may detect trivial effects", level: 'info' };
    }
    return { isValid: true, message: "Power is appropriate", level: 'info' };
  };

  // Update validation messages when parameters change
  useEffect(() => {
    const newValidation: Record<string, ValidationResult> = {};
    
    if (params.sampleSize !== null) {
      newValidation.sampleSize = validateSampleSize(params.sampleSize);
    }
    if (params.effectSize !== null && params.test) {
      newValidation.effectSize = validateEffectSize(params.effectSize, params.test);
    }
    if (params.significanceLevel !== null) {
      newValidation.significanceLevel = validateSignificanceLevel(params.significanceLevel);
    }
    if (params.power !== null) {
      newValidation.power = validatePower(params.power);
    }
    
    setValidationMessages(newValidation);
  }, [params]);

  const getEffectSizeLabel = () => {
    return params.test ? EFFECT_SIZE_MAP[params.test]?.label || "Effect Size" : "Effect Size";
  };

  const renderValidationAlert = (fieldName: string) => {
    const validation = validationMessages[fieldName];
    if (!validation?.message) return null;

    const Icon = validation.level === 'error' ? AlertTriangle : 
                 validation.level === 'warning' ? AlertTriangle : 
                 validation.level === 'info' ? Info : CheckCircle;
    
    const colorClass = validation.level === 'error' ? 'destructive' : 
                       validation.level === 'warning' ? 'default' : 'default';

    return (
      <Alert className={`mt-2 ${colorClass}`}>
        <Icon className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {validation.message}
        </AlertDescription>
      </Alert>
    );
  };

  const getEffectSizeQuickSets = () => {
    if (!params.test || !EFFECT_SIZE_MAP[params.test]) return null;
    
    const config = EFFECT_SIZE_MAP[params.test];
    return (
      <div className="flex gap-2 mt-2">
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleParameterChange("effectSize", config.small)}
        >
          Small ({config.small})
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleParameterChange("effectSize", config.medium)}
        >
          Medium ({config.medium})
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleParameterChange("effectSize", config.large)}
        >
          Large ({config.large})
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showControl("sampleSize") && targetParameter !== "sampleSize" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Sample Size
            <InfoTooltip content="The number of observations or participants in your study. Larger samples provide more statistical power but require more resources. Consider practical constraints and ethical considerations." />
          </label>
          <div className="space-y-2">
            <Input 
              type="number" 
              min="4" 
              max="10000" 
              value={params.sampleSize || ""} 
              onChange={(e) => handleParameterChange("sampleSize", Number(e.target.value))}
              className={validationMessages.sampleSize?.isValid === false ? "border-destructive" : ""}
            />
            <div className="text-xs text-muted-foreground">
              Recommended: 20-1000 participants depending on effect size and desired power
            </div>
            {renderValidationAlert("sampleSize")}
          </div>
        </div>
      )}

      {showControl("effectSize") && targetParameter !== "effectSize" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Effect Size ({getEffectSizeLabel()})
            <InfoTooltip content="The magnitude of the effect you're trying to detect. Effect sizes are standardized measures that allow comparison across different studies and contexts. Cohen's conventions provide rough guidelines for small, medium, and large effects." />
          </label>
          <div className="space-y-3">
            {params.test && EFFECT_SIZE_MAP[params.test] ? (
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
                formatValue={(val) => val.toFixed(3)}
              />
            ) : (
              <SliderWithLabels
                value={[params.effectSize || 0]}
                min={0}
                max={2}
                step={0.01}
                onValueChange={(value) => handleParameterChange("effectSize", value[0])}
                labels={[
                  { value: 0, label: '0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                  { value: 2, label: '2.0' }
                ]}
                formatValue={(val) => val.toFixed(3)}
              />
            )}
            <Input 
              type="number" 
              min="0" 
              max="5" 
              step="0.01" 
              value={params.effectSize?.toFixed(3) || ""} 
              onChange={(e) => handleParameterChange("effectSize", Number(e.target.value))}
              className={validationMessages.effectSize?.isValid === false ? "border-destructive" : ""}
            />
            {getEffectSizeQuickSets()}
            {renderValidationAlert("effectSize")}
          </div>
        </div>
      )}

      {showControl("significanceLevel") && targetParameter !== "significanceLevel" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Significance Level (α)
            <InfoTooltip content="The probability of rejecting the null hypothesis when it is true (Type I error rate). Lower values are more conservative but require larger samples. The choice depends on the consequences of false positives in your research context." />
          </label>
          <div className="space-y-3">
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
              formatValue={(val) => val.toFixed(4)}
            />
            <Input 
              type="number" 
              min="0.001" 
              max="0.1" 
              step="0.001" 
              value={params.significanceLevel?.toFixed(4) || ""} 
              onChange={(e) => handleParameterChange("significanceLevel", Number(e.target.value))}
              className={validationMessages.significanceLevel?.isValid === false ? "border-destructive" : ""}
            />
            <div className="flex gap-2 mt-2">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleParameterChange("significanceLevel", 0.001)}
              >
                Very Strict (0.001)
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleParameterChange("significanceLevel", 0.01)}
              >
                Strict (0.01)
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleParameterChange("significanceLevel", 0.05)}
              >
                Standard (0.05)
              </Badge>
            </div>
            {renderValidationAlert("significanceLevel")}
          </div>
        </div>
      )}

      {showControl("power") && targetParameter !== "power" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Power (1-β)
            <InfoTooltip content="The probability of detecting a true effect when it exists (sensitivity). Higher power reduces the risk of Type II errors but may require larger samples. The choice depends on the consequences of missing true effects in your research." />
          </label>
          <div className="space-y-3">
            <SliderWithLabels
              value={[params.power || 0.8]}
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
              className={validationMessages.power?.isValid === false ? "border-destructive" : ""}
            />
            <div className="flex gap-2 mt-2">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleParameterChange("power", 0.8)}
              >
                Standard (0.80)
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleParameterChange("power", 0.9)}
              >
                High (0.90)
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleParameterChange("power", 0.95)}
              >
                Very High (0.95)
              </Badge>
            </div>
            {renderValidationAlert("power")}
          </div>
        </div>
      )}
    </div>
  );
}