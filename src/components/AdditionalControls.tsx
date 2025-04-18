
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
    </div>
  );
}
