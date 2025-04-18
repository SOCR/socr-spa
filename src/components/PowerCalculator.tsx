
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function PowerCalculator() {
  const [targetParameter, setTargetParameter] = useState<keyof Omit<PowerParameters, "test">>("power");
  const [params, setParams] = useState<PowerParameters>({
    test: "ttest-two-sample",
    sampleSize: 30,
    effectSize: 0.5,
    significanceLevel: 0.05,
    power: 0.8
  });
  
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  
  useEffect(() => {
    calculateTargetParameter();
  }, [params.test, params.sampleSize, params.effectSize, params.significanceLevel, params.power, targetParameter]);
  
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
  
  const handleParameterChange = (name: keyof Omit<PowerParameters, "test">, value: number) => {
    if (name !== targetParameter) {
      setParams(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const getEffectSizeLabel = () => {
    return EFFECT_SIZE_MAP[params.test].label;
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
                    <SelectItem value="correlation">Correlation</SelectItem>
                    <SelectItem value="chi-square">Chi-square test</SelectItem>
                    <SelectItem value="linear-regression">Linear regression</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Target Parameter to Calculate
                  <InfoTooltip content="Select which parameter you want to calculate based on the other four parameters." />
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
                {targetParameter !== "sampleSize" && (
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

                {targetParameter !== "effectSize" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Effect Size ({getEffectSizeLabel()})
                      <InfoTooltip content="The magnitude of the effect you're trying to detect. Values can be considered small, medium, or large according to Cohen's conventions." />
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[params.effectSize || 0]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) => handleParameterChange("effectSize", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>Small ({EFFECT_SIZE_MAP[params.test].small})</span>
                        <span>Medium ({EFFECT_SIZE_MAP[params.test].medium})</span>
                        <span>Large ({EFFECT_SIZE_MAP[params.test].large})</span>
                      </div>
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

                {targetParameter !== "significanceLevel" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Significance Level (α)
                      <InfoTooltip content="The probability of rejecting the null hypothesis when it is true (Type I error). Commonly set at 0.05 (5%)." />
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[params.significanceLevel || 0]}
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        onValueChange={(value) => handleParameterChange("significanceLevel", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>0.001</span>
                        <span>0.05</span>
                        <span>0.10</span>
                      </div>
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

                {targetParameter !== "power" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Power (1-β)
                      <InfoTooltip content="The probability of detecting a true effect (sensitivity). Equals 1 minus the probability of a Type II error. A value of 0.8 (80%) is commonly used." />
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[params.power || 0]}
                        min={0.5}
                        max={0.999}
                        step={0.001}
                        onValueChange={(value) => handleParameterChange("power", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>0.5</span>
                        <span>0.8</span>
                        <span>0.99</span>
                      </div>
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
              This statistical power analyzer helps you understand the relationship between the five key components in power analysis:
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
