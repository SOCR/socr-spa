import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PowerParameters, StatisticalTest } from "@/types/power-analysis";
import { PowerChart } from "@/components/PowerChart";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TEST_CONFIGURATIONS } from "@/utils/test-configurations";
import { PowerControlsEnhanced } from "@/components/enhanced/PowerControlsEnhanced";
import { AdditionalControls } from "@/components/AdditionalControls";
import { usePowerCalculation } from "@/hooks/usePowerCalculation";
import { CalculatedResultEnhanced } from "@/components/enhanced/CalculatedResultEnhanced";
import { PowerValidationSystem } from "@/components/validation/PowerValidationSystem";
import { PowerAnalysisTestSuite } from "@/components/testing/PowerAnalysisTestSuite";
import { PowerInstructions } from "@/components/PowerInstructions";
import { TestFormulas } from "@/components/TestFormulas";

export function PowerCalculator() {
  const [targetParameter, setTargetParameter] = useState<keyof Omit<PowerParameters, "test">>("sampleSize");
  const [showAdvancedValidation, setShowAdvancedValidation] = useState(false);
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [params, setParams] = useState<PowerParameters>({
    test: "ttest-two-sample",
    sampleSize: 30,
    effectSize: 0.5,
    significanceLevel: 0.05,
    power: 0.8,
    tailType: "two",
    degreesOfFreedom: 10
  });

  const calculatedValue = usePowerCalculation(params, targetParameter);

  // Apply default values when test type changes
  useEffect(() => {
    const config = TEST_CONFIGURATIONS[params.test];
    if (config?.defaultValues) {
      setParams(prev => ({
        ...prev,
        ...config.defaultValues
      }));
    }
  }, [params.test]);

  const handleTestChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      test: value as StatisticalTest
    }));
  };

  const handleTargetChange = (value: string) => {
    setTargetParameter(value as keyof Omit<PowerParameters, "test">);
  };

  const handleParameterChange = (name: keyof PowerParameters, value: number | string) => {
    if (name !== targetParameter) {
      console.log(`Parameter changed: ${name} = ${value}`);
      setParams(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const showControl = (controlName: keyof Omit<PowerParameters, "test">): boolean => {
    const config = TEST_CONFIGURATIONS[params.test];
    return config?.parameters.includes(controlName) || false;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            SOCR Statistical Power Analyzer (SPA)
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Enhanced power analysis with comprehensive validation and testing capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Select Statistical Test
                <InfoTooltip content="Choose the statistical test that will be used to analyze your data. Different tests have different formulations for power analysis." />
              </h3>
              <Select value={params.test} onValueChange={handleTestChange}>
                <SelectTrigger className="bg-white border-2 focus:border-primary">
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEST_CONFIGURATIONS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {TEST_CONFIGURATIONS[params.test] && (
                <p className="text-sm text-muted-foreground">
                  {TEST_CONFIGURATIONS[params.test].description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Target Parameter to Calculate
                <InfoTooltip content="Select which parameter you want to calculate based on the other parameters." />
              </h3>
              <Select value={targetParameter} onValueChange={handleTargetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power">Power (1-β)</SelectItem>
                  <SelectItem value="sampleSize">Sample Size</SelectItem>
                  <SelectItem value="effectSize">Effect Size</SelectItem>
                  <SelectItem value="significanceLevel">Significance Level (α)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={showAdvancedValidation ? "default" : "outline"}
              onClick={() => setShowAdvancedValidation(!showAdvancedValidation)}
              size="sm"
            >
              Advanced Validation
            </Button>
            <Button
              variant={showTestSuite ? "default" : "outline"}
              onClick={() => setShowTestSuite(!showTestSuite)}
              size="sm"
            >
              Test Suite
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <PowerControlsEnhanced
                targetParameter={targetParameter}
                params={params}
                handleParameterChange={handleParameterChange}
                showControl={showControl}
              />
              
              <AdditionalControls
                params={params}
                handleParameterChange={handleParameterChange}
              />
            </div>

            <div className="space-y-6">
              <CalculatedResultEnhanced
                targetParameter={targetParameter}
                value={calculatedValue}
                params={params}
              />
            </div>
          </div>

          {showAdvancedValidation && (
            <PowerValidationSystem
              params={params}
              calculatedValue={calculatedValue}
              targetParameter={targetParameter}
            />
          )}

          {showTestSuite && (
            <PowerAnalysisTestSuite />
          )}

          <div>
            <PowerChart params={params} targetParameter={targetParameter} />
          </div>

          <PowerInstructions />
          
          <TestFormulas test={params.test} />
        </CardContent>
      </Card>
    </div>
  );
}