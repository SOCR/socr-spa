import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/InfoTooltip";
import { PowerParameters } from "@/types/power-analysis";
import { EFFECT_SIZE_MAP } from "@/utils/powerAnalysis";
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";

interface CalculatedResultEnhancedProps {
  targetParameter: string;
  value: number | null;
  params: PowerParameters;
}

export function CalculatedResultEnhanced({ targetParameter, value, params }: CalculatedResultEnhancedProps) {
  const formatValue = (val: number, param: string): string => {
    switch (param) {
      case "sampleSize":
        return Math.ceil(val).toString();
      case "power":
      case "significanceLevel":
        return val.toFixed(3);
      case "effectSize":
        return val.toFixed(3);
      default:
        return val.toFixed(2);
    }
  };

  const getInterpretation = (param: string, val: number): { 
    level: 'success' | 'warning' | 'destructive' | 'default';
    message: string;
    recommendation?: string;
  } => {
    switch (param) {
      case "sampleSize":
        if (val < 20) return { 
          level: 'warning', 
          message: 'Small sample size may have limited power',
          recommendation: 'Consider increasing effect size expectations or reducing power requirements'
        };
        if (val > 1000) return { 
          level: 'warning', 
          message: 'Large sample size - may detect trivial effects',
          recommendation: 'Ensure effect size represents meaningful difference'
        };
        return { 
          level: 'success', 
          message: 'Sample size is appropriate for your study requirements'
        };
      
      case "power":
        if (val < 0.8) return { 
          level: 'warning', 
          message: 'Power below conventional threshold (0.8)',
          recommendation: 'Consider increasing sample size or effect size, or reducing significance level'
        };
        if (val > 0.95) return { 
          level: 'warning', 
          message: 'Very high power - may detect trivial effects',
          recommendation: 'Consider if smaller sample size would be sufficient'
        };
        return { 
          level: 'success', 
          message: 'Good statistical power for detecting meaningful effects'
        };
      
      case "effectSize":
        const testConfig = params.test ? EFFECT_SIZE_MAP[params.test] : null;
        if (!testConfig) return { level: 'default', message: 'Effect size calculated' };
        
        if (val < testConfig.small) return { 
          level: 'warning', 
          message: 'Very small effect size',
          recommendation: 'Verify this represents a meaningful difference worth detecting'
        };
        if (val > testConfig.large * 2) return { 
          level: 'warning', 
          message: 'Very large effect size',
          recommendation: 'Ensure this is realistic for your research context'
        };
        
        let sizeCategory = '';
        if (val < testConfig.medium) sizeCategory = 'small';
        else if (val < testConfig.large) sizeCategory = 'medium';
        else sizeCategory = 'large';
        
        return { 
          level: 'success', 
          message: `${sizeCategory.charAt(0).toUpperCase() + sizeCategory.slice(1)} effect size (Cohen's conventions)`
        };
      
      case "significanceLevel":
        if (val > 0.1) return { 
          level: 'warning', 
          message: 'High significance level increases Type I error risk',
          recommendation: 'Consider using a more conservative alpha level'
        };
        if (val < 0.001) return { 
          level: 'warning', 
          message: 'Very strict significance level may reduce power',
          recommendation: 'Ensure adequate power with this conservative approach'
        };
        return { 
          level: 'success', 
          message: 'Appropriate significance level for most research contexts'
        };
      
      default:
        return { level: 'default', message: 'Parameter calculated successfully' };
    }
  };

  const getEffectSizeContext = (val: number): string | null => {
    if (targetParameter !== "effectSize" || !params.test) return null;
    
    const testConfig = EFFECT_SIZE_MAP[params.test];
    if (!testConfig) return null;
    
    if (val <= testConfig.small) return "Small";
    if (val <= testConfig.medium) return "Medium";
    if (val <= testConfig.large) return "Large";
    return "Very Large";
  };

  const getPowerBenchmarks = (): { label: string; value: number; current: boolean }[] => {
    if (targetParameter !== "power" || !value) return [];
    
    const benchmarks = [
      { label: "Minimum", value: 0.5, current: false },
      { label: "Acceptable", value: 0.8, current: false },
      { label: "Good", value: 0.9, current: false },
      { label: "Excellent", value: 0.95, current: false }
    ];
    
    // Mark current level
    benchmarks.forEach(benchmark => {
      if (value >= benchmark.value && (benchmarks.indexOf(benchmark) === benchmarks.length - 1 || value < benchmarks[benchmarks.indexOf(benchmark) + 1]?.value)) {
        benchmark.current = true;
      }
    });
    
    return benchmarks;
  };

  if (value === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Calculated {targetParameter.charAt(0).toUpperCase() + targetParameter.slice(1)}
            <InfoTooltip content="Enter valid values for all required parameters to see the calculation result." />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <div className="text-6xl font-light mb-2">–</div>
            <div className="text-sm">Awaiting parameters</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const interpretation = getInterpretation(targetParameter, value);
  const effectSizeContext = getEffectSizeContext(value);
  const powerBenchmarks = getPowerBenchmarks();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Calculated {targetParameter.charAt(0).toUpperCase() + targetParameter.slice(1)}
          <InfoTooltip content={`This is the calculated ${targetParameter} based on your specified parameters. The interpretation considers standard statistical conventions and practical considerations.`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {formatValue(value, targetParameter)}
          </div>
          
          {effectSizeContext && (
            <Badge variant="outline" className="mb-2">
              {effectSizeContext} Effect Size
            </Badge>
          )}
          
          {targetParameter === "power" && powerBenchmarks.length > 0 && (
            <div className="flex justify-center gap-2 mb-4">
              {powerBenchmarks.map((benchmark, index) => (
                <Badge 
                  key={benchmark.label}
                  variant={benchmark.current ? "default" : "outline"}
                  className={benchmark.current ? "bg-primary" : ""}
                >
                  {benchmark.label} ({benchmark.value})
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Alert className={interpretation.level === 'warning' ? 'border-amber-200 bg-amber-50' : 
                          interpretation.level === 'success' ? 'border-green-200 bg-green-50' : 'default'}>
          {interpretation.level === 'success' ? <CheckCircle className="h-4 w-4" /> :
           interpretation.level === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
           <Info className="h-4 w-4" />}
          <AlertDescription>
            <div className="font-medium mb-1">{interpretation.message}</div>
            {interpretation.recommendation && (
              <div className="text-sm text-muted-foreground">{interpretation.recommendation}</div>
            )}
          </AlertDescription>
        </Alert>

        {/* Additional context for specific parameters */}
        {targetParameter === "sampleSize" && (
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• This is the minimum total sample size needed</div>
            <div>• Consider adding 10-20% for potential dropouts</div>
            <div>• Verify feasibility within your research constraints</div>
          </div>
        )}

        {targetParameter === "effectSize" && params.test && EFFECT_SIZE_MAP[params.test] && (
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Effect size measure: {EFFECT_SIZE_MAP[params.test].label}</div>
            <div>• Small: {EFFECT_SIZE_MAP[params.test].small}, Medium: {EFFECT_SIZE_MAP[params.test].medium}, Large: {EFFECT_SIZE_MAP[params.test].large}</div>
            <div>• Consider practical significance alongside statistical significance</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}