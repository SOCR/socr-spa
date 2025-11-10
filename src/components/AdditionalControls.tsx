
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
    </div>
  );
}
