
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PowerParameters } from "@/types/power-analysis";
import { 
  generatePowerCurve,
  generateEffectSizeCurve,
} from "@/utils/power-calculations";

interface PowerChartProps {
  params: PowerParameters;
  targetParameter: keyof Omit<PowerParameters, "test">;
}

export function PowerChart({ params, targetParameter }: PowerChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"sampleSize" | "effectSize">("sampleSize");
  
  useEffect(() => {
    generateChartData();
  }, [params, targetParameter, chartType]);
  
  const generateChartData = () => {
    const paramsCopy = { ...params };
    
    if (targetParameter === "power") {
      // When calculating power, we can show how it varies with sample size or effect size
      if (chartType === "sampleSize") {
        const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
        const data = generatePowerCurve(paramsCopy, sampleSizes);
        setData(data);
      } else {
        const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
        const data = generateEffectSizeCurve(paramsCopy, effectSizes);
        setData(data);
      }
    } 
    else if (targetParameter === "sampleSize") {
      // When calculating sample size, show how it varies with power or effect size
      if (chartType === "effectSize") {
        const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
        const data = effectSizes.map(es => {
          const newParams = { ...paramsCopy, effectSize: es };
          newParams.sampleSize = null;
          const calculatedSampleSize = calculateSampleSize(newParams);
          return {
            effectSize: es,
            sampleSize: calculatedSampleSize || 0
          };
        });
        setData(data);
      } else {
        // Switch to power chart since we're calculating sample size
        setChartType("effectSize");
      }
    }
    else if (targetParameter === "effectSize") {
      // When calculating effect size, show how it varies with sample size or power
      if (chartType === "sampleSize") {
        const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
        const data = sampleSizes.map(n => {
          const newParams = { ...paramsCopy, sampleSize: n };
          newParams.effectSize = null;
          const calculatedEffectSize = calculateEffectSize(newParams);
          return {
            sampleSize: n,
            effectSize: calculatedEffectSize || 0
          };
        });
        setData(data);
      } else {
        // Switch to sample size chart since we're calculating effect size
        setChartType("sampleSize");
      }
    }
    else if (targetParameter === "significanceLevel") {
      // When calculating significance level, show how it varies with power or sample size
      if (chartType === "sampleSize") {
        const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
        const data = sampleSizes.map(n => {
          const newParams = { ...paramsCopy, sampleSize: n };
          newParams.significanceLevel = null;
          const calculatedAlpha = calculateSignificanceLevel(newParams);
          return {
            sampleSize: n,
            significanceLevel: calculatedAlpha || 0
          };
        });
        setData(data);
      } else {
        // Show how alpha varies with effect size
        const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
        const data = effectSizes.map(es => {
          const newParams = { ...paramsCopy, effectSize: es };
          newParams.significanceLevel = null;
          const calculatedAlpha = calculateSignificanceLevel(newParams);
          return {
            effectSize: es,
            significanceLevel: calculatedAlpha || 0
          };
        });
        setData(data);
      }
    }
  };
  
  const toggleChartType = () => {
    setChartType(prev => prev === "sampleSize" ? "effectSize" : "sampleSize");
  };
  
  const getXAxisLabel = () => {
    return chartType === "sampleSize" ? "Sample Size" : "Effect Size";
  };
  
  const getYAxisLabel = () => {
    switch (targetParameter) {
      case "power": return "Power (1-β)";
      case "sampleSize": return "Sample Size";
      case "effectSize": return "Effect Size";
      case "significanceLevel": return "Significance Level (α)";
      default: return "";
    }
  };
  
  const getLineDataKey = () => {
    switch (targetParameter) {
      case "power": return "power";
      case "sampleSize": return "sampleSize";
      case "effectSize": return "effectSize";
      case "significanceLevel": return "significanceLevel";
      default: return "";
    }
  };
  
  const getXAxisDataKey = () => {
    return chartType === "sampleSize" ? "sampleSize" : "effectSize";
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Power Analysis Chart</h3>
      
      <button 
        className="px-4 py-2 text-sm bg-secondary rounded"
        onClick={toggleChartType}
      >
        Show variation with {chartType === "sampleSize" ? "effect size" : "sample size"}
      </button>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={getXAxisDataKey()} 
              label={{ value: getXAxisLabel(), position: 'insideBottomRight', offset: -5 }} 
            />
            <YAxis 
              label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip formatter={(value: number) => value.toFixed(3)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={getLineDataKey()} 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Import the required calculation function for the chart
function calculateSampleSize(params: PowerParameters): number | null {
  const { test, effectSize, significanceLevel, power } = params;
  
  if (effectSize === null || significanceLevel === null || power === null) return null;
  
  // For t-tests (very simplified approximation)
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    
    let n: number;
    if (test === "ttest-one-sample" || test === "ttest-paired") {
      n = Math.pow((za + zb) / effectSize, 2);
    } else {
      n = 2 * Math.pow((za + zb) / effectSize, 2);
    }
    
    return Math.ceil(n);
  }
  
  // For ANOVA
  if (test === "anova") {
    // Simple approximation for ANOVA with k=4 groups
    const k = 4;
    const lambda = -Math.log(2 * (1 - power)) / 0.3 + 2.6; // Solve for lambda
    const n = Math.ceil(lambda / (k * effectSize * effectSize));
    
    return Math.max(2, n); // Minimum 2 samples per group
  }
  
  // For correlation
  if (test === "correlation") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    const z = 0.5 * Math.log((1 + effectSize) / (1 - effectSize));
    
    const n = Math.ceil((Math.pow(za + zb, 2) / Math.pow(z, 2)) + 3);
    
    return n;
  }
  
  // For chi-square
  if (test === "chi-square") {
    // Simplified approximation
    const criticalValue = normInv(1 - significanceLevel) + Math.sqrt(2 * 3); // df=3
    const ncp = -Math.log(1 - power) * 2 + criticalValue;
    const n = Math.ceil(ncp / (effectSize * effectSize));
    
    return Math.max(5, n); // Minimum 5 samples
  }
  
  // For linear regression
  if (test === "linear-regression") {
    const u = 3; // Number of predictors
    const lambda = -Math.log(2 * (1 - power)) / 0.2 + 2.8; // Solve for lambda
    const n = Math.ceil(lambda / effectSize + u + 1);
    
    return Math.max(u + 2, n); // Minimum n > number of predictors
  }
  
  return null;
}

function calculateEffectSize(params: PowerParameters): number | null {
  const { test, sampleSize, significanceLevel, power } = params;
  
  if (sampleSize === null || significanceLevel === null || power === null) return null;
  
  // For t-tests
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    
    let d: number;
    if (test === "ttest-one-sample" || test === "ttest-paired") {
      d = (za + zb) / Math.sqrt(sampleSize);
    } else {
      d = (za + zb) / Math.sqrt(sampleSize / 2);
    }
    
    return d;
  }
  
  // For ANOVA
  if (test === "anova") {
    // Simple approximation for ANOVA with k=4 groups
    const k = 4;
    const lambda = -Math.log(2 * (1 - power)) / 0.3 + 2.6; // Solve for lambda
    const f = Math.sqrt(lambda / (k * sampleSize));
    
    return f;
  }
  
  // For correlation
  if (test === "correlation") {
    const za = normInv(1 - significanceLevel / 2);
    const zb = normInv(power);
    const fisher_z = Math.sqrt((Math.pow(za + zb, 2) / (sampleSize - 3)));
    
    // Convert Fisher's z back to correlation
    const r = (Math.exp(2 * fisher_z) - 1) / (Math.exp(2 * fisher_z) + 1);
    
    return Math.min(r, 1); // Cap at 1
  }
  
  // For chi-square
  if (test === "chi-square") {
    // Simplified approximation
    const criticalValue = normInv(1 - significanceLevel) + Math.sqrt(2 * 3); // df=3
    const ncp = -Math.log(1 - power) * 2 + criticalValue;
    const w = Math.sqrt(ncp / sampleSize);
    
    return w;
  }
  
  // For linear regression
  if (test === "linear-regression") {
    const u = 3; // Number of predictors
    const lambda = -Math.log(2 * (1 - power)) / 0.2 + 2.8; // Solve for lambda
    const f2 = lambda / (sampleSize - u - 1);
    
    return f2;
  }
  
  return null;
}

function calculateSignificanceLevel(params: PowerParameters): number | null {
  const { test, sampleSize, effectSize, power } = params;
  
  if (sampleSize === null || effectSize === null || power === null) return null;
  
  // This is a very simplified approximation for all tests
  // In practice, solving for alpha is more complex
  
  // For t-tests
  if (test === "ttest-one-sample" || test === "ttest-two-sample" || test === "ttest-paired") {
    const df = test === "ttest-one-sample" ? sampleSize - 1 : 
              test === "ttest-paired" ? sampleSize - 1 : 
              2 * sampleSize - 2;
    
    const ncp = effectSize * Math.sqrt(sampleSize);
    const t_power = tInv(power, df) + ncp;
    
    // Approximate alpha from the critical t
    const alpha = 2 * (1 - tCDF(t_power, df));
    
    return Math.min(Math.max(0.001, alpha), 0.999); // Keep in reasonable range
  }
  
  // For other tests - very rough approximation
  // In practice, these would require numerical methods to solve
  const zb = normInv(power);
  const standardizedEffect = effectSize * Math.sqrt(sampleSize);
  const za = standardizedEffect - zb;
  
  const alpha = 2 * (1 - normCDF(za));
  
  return Math.min(Math.max(0.001, alpha), 0.999); // Keep in reasonable range
}

// Normal distribution cumulative density function
function normCDF(x: number): number {
  // Approximation of the normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) p = 1 - p;
  return p;
}

// Normal distribution inverse cumulative density function (approximation)
function normInv(p: number): number {
  // Approximation of the inverse normal CDF
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  const a1 = -39.6968302866538;
  const a2 = 220.946098424521;
  const a3 = -275.928510446969;
  const a4 = 138.357751867269;
  const a5 = -30.6647980661472;
  const a6 = 2.50662827745924;

  const b1 = -54.4760987982241;
  const b2 = 161.585836858041;
  const b3 = -155.698979859887;
  const b4 = 66.8013118877197;
  const b5 = -13.2806815528857;

  const c1 = -7.78489400243029E-03;
  const c2 = -0.322396458041136;
  const c3 = -2.40075827716184;
  const c4 = -2.54973253934373;
  const c5 = 4.37466414146497;
  const c6 = 2.93816398269878;

  const d1 = 7.78469570904146E-03;
  const d2 = 0.32246712907004;
  const d3 = 2.445134137143;
  const d4 = 3.75440866190742;

  let q = p - 0.5;
  let r;

  if (Math.abs(q) <= 0.42) {
    r = q * q;
    let ppnd = q * (((a5 * r + a4) * r + a3) * r + a2) * r + a1;
    ppnd = ppnd / (((b5 * r + b4) * r + b3) * r + b2) * r + b1;
    return ppnd;
  } else {
    if (q <= 0) r = p;
    else r = 1 - p;
    
    r = Math.sqrt(-Math.log(r));
    
    if (r <= 5) {
      r = r - 1.6;
      let ppnd = (((((c6 * r + c5) * r + c4) * r + c3) * r + c2) * r + c1);
      ppnd = ppnd / (((d4 * r + d3) * r + d2) * r + d1);
      
      if (q <= 0) return -ppnd;
      else return ppnd;
    } else {
      r = r - 5;
      let ppnd = (((((c6 * r + c5) * r + c4) * r + c3) * r + c2) * r + c1);
      ppnd = ppnd / (((d4 * r + d3) * r + d2) * r + d1);
      
      if (q <= 0) return -ppnd;
      else return ppnd;
    }
  }
}

function tCDF(t: number, df: number): number {
  // This is a simple approximation of the t-distribution CDF
  // More accurate implementations would use a proper statistical library
  // For now, this will be close enough for our visualization needs
  if (df > 100) return normCDF(t);
  
  // Approximate t-distribution with adjusted normal distribution
  const x = df / (df + t * t);
  let p = 1 - 0.5 * Math.pow(x, df / 2);
  if (t < 0) p = 1 - p;
  return p;
}

function tInv(p: number, df: number): number {
  // Approximate inverse t-distribution
  // For high df, the t-distribution approaches the normal distribution
  if (df > 100) return normInv(p);
  
  // Bisection method for approximation
  let low = -10;
  let high = 10;
  let mid = 0;
  let pMid = 0;
  
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    pMid = tCDF(mid, df);
    
    if (Math.abs(pMid - p) < 0.0001) break;
    
    if (pMid < p) low = mid;
    else high = mid;
  }
  
  return mid;
}
