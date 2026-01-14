
import React from "react";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "@/components/InfoTooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PowerParameters } from "@/types/power-analysis";
import { TEST_CONFIGURATIONS } from "@/utils/test-configurations";

interface AdditionalControlsProps {
  params: PowerParameters;
  handleParameterChange: (name: keyof PowerParameters, value: number | string) => void;
}

export function AdditionalControls({ params, handleParameterChange }: AdditionalControlsProps) {
  const testConfig = TEST_CONFIGURATIONS[params.test];
  const additionalControls = testConfig?.additionalControls || {};

  return (
    <div className="space-y-4">
      {additionalControls.tailType && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Tail Type
            <InfoTooltip content="One-tailed tests detect effects in one direction only, while two-tailed tests detect effects in either direction." />
          </label>
          <Select 
            value={params.tailType || "two"} 
            onValueChange={(value) => handleParameterChange("tailType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tail type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">One-tailed</SelectItem>
              <SelectItem value="two">Two-tailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {additionalControls.groups && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Groups
            <InfoTooltip content="The number of independent groups or categories in your study." />
          </label>
          <Input 
            type="number" 
            min="2" 
            max="20" 
            value={params.groups || ""} 
            onChange={(e) => handleParameterChange("groups", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.predictors && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Predictors
            <InfoTooltip content="The number of independent variables or predictors in your regression model." />
          </label>
          <Input 
            type="number" 
            min="1" 
            max="20" 
            value={params.predictors || ""} 
            onChange={(e) => handleParameterChange("predictors", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.responseVariables && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Response Variables
            <InfoTooltip content="The number of dependent variables or outcomes in your multivariate analysis." />
          </label>
          <Input 
            type="number" 
            min="2" 
            max="10" 
            value={params.responseVariables || ""} 
            onChange={(e) => handleParameterChange("responseVariables", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.observations && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Observations per Group
            <InfoTooltip content="The number of repeated measures or observations per participant or group." />
          </label>
          <Input 
            type="number" 
            min="2" 
            max="20" 
            value={params.observations || ""} 
            onChange={(e) => handleParameterChange("observations", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.correlation && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Correlation between Measures
            <InfoTooltip content="The correlation between paired measurements or repeated measures." />
          </label>
          <Input 
            type="number" 
            min="-1" 
            max="1" 
            step="0.1" 
            value={params.correlation || ""} 
            onChange={(e) => handleParameterChange("correlation", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.timePoints && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Time Points
            <InfoTooltip content="Number of measurement occasions including baseline. Example: baseline + 3 follow-ups = 4 time points." />
          </label>
          <Input 
            type="number" 
            min="2" 
            max="10" 
            value={params.timePoints || 4} 
            onChange={(e) => handleParameterChange("timePoints", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.dropoutRate && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Expected Dropout Rate
            <InfoTooltip content="Proportion of participants expected to drop out by the final time point. Enter as decimal (e.g., 0.05 = 5%)." />
          </label>
          <Input 
            type="number" 
            min="0" 
            max="0.5" 
            step="0.01" 
            value={params.dropoutRate || 0.05} 
            onChange={(e) => handleParameterChange("dropoutRate", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {((params.dropoutRate || 0.05) * 100).toFixed(1)}% dropout rate
          </p>
        </div>
      )}

      {additionalControls.withinCorrelation && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Within-Subject Correlation
            <InfoTooltip content="Correlation between repeated measurements on the same participant. Typically 0.3-0.7 for clinical trials. Higher correlation increases power." />
          </label>
          <Input 
            type="number" 
            min="0" 
            max="0.95" 
            step="0.05" 
            value={params.withinCorrelation || 0.5} 
            onChange={(e) => handleParameterChange("withinCorrelation", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.degreesOfFreedom && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Degrees of Freedom
            <InfoTooltip content="The degrees of freedom for the model, representing the complexity of the structural equation model." />
          </label>
          <Input 
            type="number" 
            min="1" 
            max="100" 
            value={params.degreesOfFreedom || 10} 
            onChange={(e) => handleParameterChange("degreesOfFreedom", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.baselineProb && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Baseline Probability (P₀)
            <InfoTooltip content="Probability of the outcome when the predictor is at its reference level (0 for binary, mean for continuous). Typically the overall event rate in the population." />
          </label>
          <Input 
            type="number" 
            min="0.01" 
            max="0.99" 
            step="0.01" 
            value={params.baselineProb || 0.25} 
            onChange={(e) => handleParameterChange("baselineProb", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {((params.baselineProb || 0.25) * 100).toFixed(1)}% baseline event rate
          </p>
        </div>
      )}

      {additionalControls.predictorType && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Predictor Type
            <InfoTooltip content="Binary: categorical predictor (e.g., treatment/control). Continuous: numeric predictor (e.g., age, blood pressure)." />
          </label>
          <Select 
            value={params.predictorType || "continuous"} 
            onValueChange={(value) => handleParameterChange("predictorType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select predictor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binary">Binary (0/1)</SelectItem>
              <SelectItem value="continuous">Continuous</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {additionalControls.predictorProportion && params.predictorType === "binary" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Proportion with Predictor = 1 (p₁)
            <InfoTooltip content="Proportion of sample with the predictor present. For balanced groups, use 0.5." />
          </label>
          <Input 
            type="number" 
            min="0.1" 
            max="0.9" 
            step="0.05" 
            value={params.predictorProportion || 0.5} 
            onChange={(e) => handleParameterChange("predictorProportion", Number(e.target.value))}
          />
        </div>
      )}

      {additionalControls.predictorVariance && params.predictorType === "continuous" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Predictor Variance (σ²ₓ)
            <InfoTooltip content="Variance of the continuous predictor. Use 1.0 for standardized predictors. For unstandardized predictors, enter the actual variance." />
          </label>
          <Input 
            type="number" 
            min="0.01" 
            max="100" 
            step="0.1" 
            value={params.predictorVariance || 1.0} 
            onChange={(e) => handleParameterChange("predictorVariance", Number(e.target.value))}
          />
        </div>
      )}

      {/* Number of Predictors for multivariate logistic regression */}
      {additionalControls.numPredictors && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Predictors
            <InfoTooltip content="Total number of predictor variables in the logistic regression model. More predictors require larger samples." />
          </label>
          <Input 
            type="number" 
            min="1" 
            max="20" 
            value={params.numPredictors || 1} 
            onChange={(e) => handleParameterChange("numPredictors", Number(e.target.value))}
          />
          {params.numPredictors && params.numPredictors > 1 && params.baselineProb && params.sampleSize && (
            <p className="text-xs text-muted-foreground mt-1">
              Rule of thumb: ≥10 events per predictor. 
              Expected events: ~{Math.round((params.baselineProb || 0.25) * (params.sampleSize || 100))}
            </p>
          )}
        </div>
      )}

      {/* R² with Other Predictors for VIF adjustment */}
      {additionalControls.r2Other && (params.numPredictors || 1) > 1 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            R² with Other Predictors
            <InfoTooltip content="Squared multiple correlation of the target predictor with all other predictors. Used to calculate Variance Inflation Factor (VIF). Higher values reduce power due to multicollinearity." />
          </label>
          <Input 
            type="number" 
            min="0" 
            max="0.95" 
            step="0.05" 
            value={params.r2Other || 0} 
            onChange={(e) => handleParameterChange("r2Other", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            VIF = {(1 / (1 - (params.r2Other || 0))).toFixed(2)}
            {(params.r2Other || 0) >= 0.5 && " (high multicollinearity)"}
          </p>
        </div>
      )}

      {/* Display calculated P₁ for logistic regression */}
      {params.test === "logistic-regression" && params.effectSize && params.baselineProb && (
        <div className="bg-muted/30 p-3 rounded-md text-sm space-y-1">
          <p className="font-medium mb-2">Calculated Values:</p>
          <div className="flex justify-between">
            <span>Odds Ratio (OR)</span>
            <span className="font-mono">{Math.exp(params.effectSize).toFixed(3)}</span>
          </div>
          {(() => {
            const P0 = params.baselineProb || 0.25;
            const OR = Math.exp(params.effectSize);
            const odds0 = P0 / (1 - P0);
            const odds1 = odds0 * OR;
            const P1 = odds1 / (1 + odds1);
            return (
              <>
                <div className="flex justify-between">
                  <span>P₀ (baseline prob.)</span>
                  <span className="font-mono">{P0.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>P₁ (exposed prob.)</span>
                  <span className="font-mono">{P1.toFixed(3)}</span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
