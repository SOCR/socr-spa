
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PowerParameters, StatisticalTest } from "@/types/power-analysis";
import { 
  EFFECT_SIZE_MAP, 
  calculatePower, 
  calculateSampleSize, 
  calculateEffectSize, 
  calculateSignificanceLevel 
} from "@/utils/power-calculations";
import { PowerChart } from "@/components/PowerChart";
import { InfoTooltip } from "@/components/InfoTooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TEST_CONFIGURATIONS } from "@/utils/test-configurations";
import { PowerControls } from "@/components/PowerControls";
import { AdditionalControls } from "@/components/AdditionalControls";

export function PowerCalculator() {
  const [targetParameter, setTargetParameter] = useState<keyof Omit<PowerParameters, "test">>("power");
  const [params, setParams] = useState<PowerParameters>({
    test: "ttest-two-sample",
    sampleSize: 30,
    effectSize: 0.5,
    significanceLevel: 0.05,
    power: 0.8,
    tailType: "two"
  });
  
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  
  useEffect(() => {
    calculateTargetParameter();
  }, [params, targetParameter]);

  // Apply default values when test type changes
  useEffect(() => {
    const config = TEST_CONFIGURATIONS[params.test];
    if (config && config.defaultValues) {
      setParams(prev => ({
        ...prev,
        ...config.defaultValues
      }));
    }
  }, [params.test]);
  
  const calculateTargetParameter = () => {
    const paramsCopy = { ...params };
    
    // Set the target parameter to null before calculation
    paramsCopy[targetParameter] = null;
    
    // Calculate the target parameter
    let result: number | null = null;
    
    switch (targetParameter) {
      case "power":
        result = calculatePower(paramsCopy);
        break;
      case "sampleSize":
        result = calculateSampleSize(paramsCopy);
        break;
      case "effectSize":
        result = calculateEffectSize(paramsCopy);
        break;
      case "significanceLevel":
        result = calculateSignificanceLevel(paramsCopy);
        break;
    }
    
    setCalculatedValue(result);
  };
  
  const handleTestChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      test: value as StatisticalTest
    }));
  };
  
  const handleTargetChange = (value: string) => {
    setTargetParameter(value as keyof Omit<PowerParameters, "test">);
  };
  
  const handleParameterChange = (name: keyof Omit<PowerParameters, "test">, value: number | string) => {
    if (name !== targetParameter) {
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
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">SOCR Statistical Power Analyzer (SPA)</CardTitle>
          <CardDescription className="text-center">
            Calculate the relationship between sample size, effect size, significance level, and power.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="ttest-one-sample">One-sample t-test</SelectItem>
                    <SelectItem value="ttest-two-sample">Two-sample t-test</SelectItem>
                    <SelectItem value="ttest-paired">Paired t-test</SelectItem>
                    <SelectItem value="anova">One-way ANOVA</SelectItem>
                    <SelectItem value="anova-two-way">Two-way ANOVA</SelectItem>
                    <SelectItem value="correlation">Correlation</SelectItem>
                    <SelectItem value="correlation-difference">Differences between Correlations</SelectItem>
                    <SelectItem value="proportion-test">Proportion Test (0.50)</SelectItem>
                    <SelectItem value="sign-test">Sign Test</SelectItem>
                    <SelectItem value="proportion-difference">Differences between Proportions</SelectItem>
                    <SelectItem value="chi-square-gof">Chi-square Goodness of Fit</SelectItem>
                    <SelectItem value="chi-square-contingency">Chi-square Contingency Tables</SelectItem>
                    <SelectItem value="linear-regression">Simple Linear Regression</SelectItem>
                    <SelectItem value="multiple-regression">Multiple Regression</SelectItem>
                    <SelectItem value="set-correlation">Set Correlation</SelectItem>
                    <SelectItem value="multivariate">Multivariate Methods</SelectItem>
                  </SelectContent>
                </Select>
                
                {TEST_CONFIGURATIONS[params.test] && (
                  <p className="text-sm text-gray-600">
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

              <div className="space-y-4">
                <AdditionalControls 
                  params={params} 
                  handleParameterChange={handleParameterChange} 
                />
                
                <PowerControls 
                  targetParameter={targetParameter}
                  params={params} 
                  handleParameterChange={handleParameterChange} 
                  showControl={showControl}
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Calculated {targetParameter}</h3>
                <div className="text-4xl font-bold text-primary">
                  {calculatedValue !== null ? (
                    targetParameter === "sampleSize" 
                      ? Math.ceil(calculatedValue) 
                      : calculatedValue.toFixed(
                          targetParameter === "significanceLevel" || targetParameter === "power" 
                            ? 3 
                            : 2
                        )
                  ) : 'N/A'}
                </div>
              </div>
            </div>

            <div>
              <PowerChart params={params} targetParameter={targetParameter} />
            </div>
          </div>
          
          <div className="mt-8 prose max-w-full">
            <h3>How to Use This Calculator</h3>
            <p>
              This statistical power analyzer helps you understand the relationship between the key components in power analysis:
            </p>
            <ol>
              <li><strong>Statistical Test:</strong> The specific statistical inference method you will use to analyze your data.</li>
              <li><strong>Sample Size:</strong> The number of observations in your study.</li>
              <li><strong>Effect Size:</strong> How large the effect of interest is expected to be.</li>
              <li><strong>Significance Level (α):</strong> The probability of finding an effect that is not there (Type I error).</li>
              <li><strong>Power (1-β):</strong> The probability of finding an effect that is there (sensitivity).</li>
            </ol>
            <p>
              To use the calculator, select which parameter you want to calculate, then provide values for the other parameters.
              The graph shows how the target parameter changes as either sample size or effect size varies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
