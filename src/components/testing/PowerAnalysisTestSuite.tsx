import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { calculateScientificPower, calculateScientificSampleSize, calculateScientificEffectSize } from "@/utils/powerAnalysis";
import { PowerParameters, StatisticalTest } from "@/types/power-analysis";
import { CheckCircle, XCircle, Play, RefreshCw, Info, ChevronDown } from "lucide-react";
import { getAccurateTestCase } from './AccurateTestBaselines';
import { computeDiagnostics, DiagnosticResults } from '@/utils/powerAnalysis/diagnostics';

interface TestCase {
  id: string;
  name: string;
  description: string;
  params: PowerParameters;
  expectedResults: {
    power?: number;
    sampleSize?: number;
    effectSize?: number;
  };
  tolerance: number;
}

export function PowerAnalysisTestSuite() {
  const [testResults, setTestResults] = useState<Record<string, {
    passed: boolean;
    actualValue: number | null;
    expectedValue: number;
    difference: number;
    executionTime: number;
    diagnostics?: DiagnosticResults;
  }>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // PHASE 1: Build test cases dynamically from AccurateTestBaselines (single source of truth)
  const testCases: TestCase[] = React.useMemo(() => {
    const testIds = [
      "ttest-power-medium",
      "ttest-sample-size", 
      "ttest-one-sample-power",
      "ttest-paired-power",
      "correlation-power",
      "anova-power",
      "anova-sample-size",
      "chi-square-power",
      "proportion-power",
      "regression-power",
      "regression-effect-size",
      "sem-power",
      "small-sample-warning",
      "large-effect-test"
    ];

    const testDescriptions: Record<string, { name: string; description: string }> = {
      "ttest-power-medium": {
        name: "T-Test Power (Medium Effect)",
        description: "Two-sample t-test with medium effect size (d=0.5), n=128, α=0.05"
      },
      "ttest-sample-size": {
        name: "T-Test Sample Size",
        description: "Sample size for two-sample t-test, d=0.5, power=0.8, α=0.05"
      },
      "ttest-one-sample-power": {
        name: "One-Sample T-Test Power",
        description: "One-sample t-test with d=0.5, n=27, α=0.05"
      },
      "ttest-paired-power": {
        name: "Paired T-Test Power",
        description: "Paired t-test with d=0.5, n=34, α=0.05, r=0.5"
      },
      "correlation-power": {
        name: "Correlation Power",
        description: "Correlation test with r=0.3, n=84, α=0.05, two-tailed"
      },
      "anova-power": {
        name: "ANOVA Power",
        description: "One-way ANOVA with f=0.25, n=180, α=0.05, 4 groups"
      },
      "anova-sample-size": {
        name: "ANOVA Sample Size",
        description: "One-way ANOVA, f=0.25, power=0.8, α=0.05, 4 groups"
      },
      "chi-square-power": {
        name: "Chi-Square Power",
        description: "Chi-square test with w=0.3, n=88, α=0.05, df=2"
      },
      "proportion-power": {
        name: "Proportion Test Power",
        description: "Proportion test with h=0.5, n=128, α=0.05"
      },
      "regression-power": {
        name: "Multiple Regression Power",
        description: "Multiple regression with f²=0.15, n=77, α=0.05, 3 predictors"
      },
      "regression-effect-size": {
        name: "Regression Effect Size",
        description: "Multiple regression, n=77, power=0.8, α=0.05, 3 predictors"
      },
      "sem-power": {
        name: "SEM Power",
        description: "SEM with RMSEA=0.08, n=158, α=0.05, df=10, close-fit test"
      },
      "small-sample-warning": {
        name: "Small Sample Edge Case",
        description: "Very small sample size test (n=10)"
      },
      "large-effect-test": {
        name: "Large Effect Size Test",
        description: "Very large effect size (d=2.0)"
      }
    };

    return testIds.map(id => {
      const baseline = getAccurateTestCase(id);
      if (!baseline) {
        throw new Error(`No baseline found for test case: ${id}`);
      }
      
      return {
        id,
        name: testDescriptions[id]?.name || id,
        description: testDescriptions[id]?.description || "",
        params: baseline.params,
        expectedResults: baseline.expectedResults,
        tolerance: baseline.tolerance
      };
    });
  }, []);

  const runTestCase = (testCase: TestCase): Promise<{
    passed: boolean;
    actualValue: number | null;
    expectedValue: number;
    difference: number;
    executionTime: number;
    diagnostics?: DiagnosticResults;
  }> => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      let actualValue: number | null = null;
      let expectedValue: number = 0;
      
      try {
        if (testCase.expectedResults.power !== undefined) {
          actualValue = calculateScientificPower(testCase.params);
          expectedValue = testCase.expectedResults.power;
        } else if (testCase.expectedResults.sampleSize !== undefined) {
          actualValue = calculateScientificSampleSize(testCase.params);
          expectedValue = testCase.expectedResults.sampleSize;
        } else if (testCase.expectedResults.effectSize !== undefined) {
          actualValue = calculateScientificEffectSize(testCase.params);
          expectedValue = testCase.expectedResults.effectSize;
        }
        
        const executionTime = performance.now() - startTime;
        const difference = actualValue ? Math.abs(actualValue - expectedValue) / expectedValue : 1;
        const passed = actualValue !== null && difference <= testCase.tolerance;
        
        // Generate diagnostics for failing tests or when diagnostics are enabled
        let diagnostics: DiagnosticResults | undefined;
        if (!passed || showDiagnostics) {
          try {
            diagnostics = computeDiagnostics(testCase.params);
          } catch (error) {
            console.warn("Failed to generate diagnostics:", error);
          }
        }
        
        resolve({
          passed,
          actualValue,
          expectedValue,
          difference,
          executionTime,
          diagnostics
        });
      } catch (error) {
        const executionTime = performance.now() - startTime;
        resolve({
          passed: false,
          actualValue: null,
          expectedValue,
          difference: 1,
          executionTime,
          diagnostics: showDiagnostics ? computeDiagnostics(testCase.params) : undefined
        });
      }
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    const results: typeof testResults = {};
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const result = await runTestCase(testCase);
      results[testCase.id] = result;
      setTestResults({ ...results });
      setProgress(((i + 1) / testCases.length) * 100);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsRunning(false);
  };

  const getTestStats = () => {
    const total = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter(r => r.passed).length;
    const avgExecutionTime = Object.values(testResults).reduce((sum, r) => sum + r.executionTime, 0) / total || 0;
    
    return { total, passed, avgExecutionTime };
  };

  const stats = getTestStats();

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Power Analysis Test Suite
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="diagnostics" 
                checked={showDiagnostics} 
                onCheckedChange={setShowDiagnostics}
                disabled={isRunning}
              />
              <Label htmlFor="diagnostics" className="text-sm">Show Diagnostics</Label>
            </div>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? "Running Tests..." : "Run Tests"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running tests...</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {Object.keys(testResults).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-muted-foreground">Tests Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.total - stats.passed}</div>
                <div className="text-sm text-muted-foreground">Tests Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.avgExecutionTime.toFixed(1)}ms</div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-3">
          {testCases.map((testCase) => {
            const result = testResults[testCase.id];
            
            return (
              <Card key={testCase.id} className={
                result?.passed === true ? "border-green-200 bg-green-50" :
                result?.passed === false ? "border-red-200 bg-red-50" : ""
              }>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result?.passed === true && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {result?.passed === false && <XCircle className="h-4 w-4 text-red-600" />}
                      <span className="font-medium">{testCase.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {testCase.params.test}
                      </Badge>
                    </div>
                    {result && (
                      <div className="text-sm text-muted-foreground">
                        {result.executionTime.toFixed(1)}ms
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    {testCase.description}
                  </div>
                  
                  {result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Expected:</span> {result.expectedValue.toFixed(3)}
                      </div>
                      <div>
                        <span className="font-medium">Actual:</span> {result.actualValue?.toFixed(3) || "N/A"}
                      </div>
                       <div>
                        <span className="font-medium">Difference:</span> 
                        <span className={result.difference <= testCase.tolerance ? "text-green-600" : "text-red-600"}>
                          {(result.difference * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Diagnostics section for failing tests or when enabled */}
                  {result?.diagnostics && (showDiagnostics || !result.passed) && (
                    <Collapsible className="mt-4">
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                        <ChevronDown className="h-4 w-4" />
                        Diagnostic Information
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-3 bg-gray-50 rounded border text-sm">
                        <div className="space-y-2">
                          <div><span className="font-medium">Test:</span> {result.diagnostics.testType}</div>
                          
                          {result.diagnostics.intermediates.degreesOfFreedom && (
                            <div>
                              <span className="font-medium">Degrees of Freedom:</span>
                              {result.diagnostics.intermediates.degreesOfFreedom.df && 
                                ` df=${result.diagnostics.intermediates.degreesOfFreedom.df}`}
                              {result.diagnostics.intermediates.degreesOfFreedom.df1 && 
                                ` df1=${result.diagnostics.intermediates.degreesOfFreedom.df1}`}
                              {result.diagnostics.intermediates.degreesOfFreedom.df2 && 
                                ` df2=${result.diagnostics.intermediates.degreesOfFreedom.df2}`}
                            </div>
                          )}
                          
                          {result.diagnostics.intermediates.noncentralityParameter !== undefined && (
                            <div>
                              <span className="font-medium">Non-centrality Parameter:</span> {result.diagnostics.intermediates.noncentralityParameter.toFixed(4)}
                            </div>
                          )}
                          
                          {result.diagnostics.intermediates.criticalValue !== undefined && (
                            <div>
                              <span className="font-medium">Critical Value:</span> {result.diagnostics.intermediates.criticalValue.toFixed(4)}
                            </div>
                          )}
                          
                          {result.diagnostics.calculations.referenceMethod !== null && (
                            <div className="pt-2 border-t">
                              <div><span className="font-medium">Current Method:</span> {result.diagnostics.calculations.currentMethod?.toFixed(4) || "N/A"}</div>
                              <div><span className="font-medium">Reference Method:</span> {result.diagnostics.calculations.referenceMethod.toFixed(4)}</div>
                              {result.diagnostics.calculations.percentDifference !== undefined && (
                                <div><span className="font-medium">Method Difference:</span> {result.diagnostics.calculations.percentDifference.toFixed(2)}%</div>
                              )}
                            </div>
                          )}
                          
                          {result.diagnostics.warnings.length > 0 && (
                            <div className="pt-2 border-t">
                              <span className="font-medium text-orange-600">Warnings:</span>
                              <ul className="ml-4 list-disc text-orange-600">
                                {result.diagnostics.warnings.map((warning, idx) => (
                                  <li key={idx}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This test suite validates power analysis calculations against GOLD STANDARD values from G*Power, R, and PASS software. 
            Tests use accurate baselines verified by external statistical software for maximum reliability.
            All calculations now use robust numerical methods for precision.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}