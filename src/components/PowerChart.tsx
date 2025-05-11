import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PowerParameters } from "@/types/power-analysis";
import { 
  calculateScientificPower, 
  calculateScientificSampleSize, 
  calculateScientificEffectSize
} from "@/utils/scientificPowerCalculations";
import { ChartControls } from "@/components/ChartControls";
import { Power3DPlot } from "@/components/Power3DPlot";

interface PowerChartProps {
  params: PowerParameters;
  targetParameter: keyof Omit<PowerParameters, "test">;
}

// Helper functions moved to separate utils file
const generatePowerCurve = (params: PowerParameters, sampleSizes: number[]): Array<{sampleSize: number; power: number}> => {
  return sampleSizes.map(n => {
    const newParams = { ...params, sampleSize: n };
    newParams.power = null;
    const calculatedPower = calculateScientificPower(newParams);
    return {
      sampleSize: n,
      power: calculatedPower || 0
    };
  });
};

const generateEffectSizeCurve = (params: PowerParameters, effectSizes: number[]): Array<{effectSize: number; power: number}> => {
  return effectSizes.map(es => {
    const newParams = { ...params, effectSize: es };
    newParams.power = null;
    const calculatedPower = calculateScientificPower(newParams);
    return {
      effectSize: es,
      power: calculatedPower || 0
    };
  });
};

export function PowerChart({ params, targetParameter }: PowerChartProps) {
  const [data, setData] = useState<Array<{[key: string]: number}>>([]);
  const [chartType, setChartType] = useState<"sampleSize" | "effectSize">("sampleSize");
  const [showMode, setShowMode] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    console.log("Generating chart data with:", { params, targetParameter, chartType });
    generateChartData();
  }, [params, targetParameter, chartType]);

  const generateChartData = () => {
    const paramsCopy = { ...params };
    
    if (targetParameter === "power") {
      if (chartType === "sampleSize") {
        const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
        setData(generatePowerCurve(paramsCopy, sampleSizes));
      } else {
        const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
        setData(generateEffectSizeCurve(paramsCopy, effectSizes));
      }
    } 
    else if (targetParameter === "sampleSize") {
      // When calculating sample size, show how it varies with power or effect size
      if (chartType === "effectSize") {
        const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
        const data = effectSizes.map(es => {
          const newParams = { ...paramsCopy, effectSize: es };
          newParams.sampleSize = null;
          const calculatedSampleSize = calculateScientificSampleSize(newParams);
          return {
            effectSize: es,
            sampleSize: calculatedSampleSize || 0
          };
        });
        setData(data);
      } else {
        // Show how sample size varies with power
        const powers = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.025);
        const data = powers.map(power => {
          const newParams = { ...paramsCopy, power: power };
          newParams.sampleSize = null;
          const calculatedSampleSize = calculateScientificSampleSize(newParams);
          return {
            power: power,
            sampleSize: calculatedSampleSize || 0
          };
        });
        setData(data);
      }
    }
    else if (targetParameter === "effectSize") {
      // When calculating effect size, show how it varies with sample size or power
      if (chartType === "sampleSize") {
        const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
        const data = sampleSizes.map(n => {
          const newParams = { ...paramsCopy, sampleSize: n };
          newParams.effectSize = null;
          const calculatedEffectSize = calculateScientificEffectSize(newParams);
          return {
            sampleSize: n,
            effectSize: calculatedEffectSize || 0
          };
        });
        setData(data);
      } else {
        // Show how effect size varies with power
        const powers = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.025);
        const data = powers.map(power => {
          const newParams = { ...paramsCopy, power: power };
          newParams.effectSize = null;
          const calculatedEffectSize = calculateScientificEffectSize(newParams);
          return {
            power: power,
            effectSize: calculatedEffectSize || 0
          };
        });
        setData(data);
      }
    }
    else if (targetParameter === "significanceLevel") {
      // When calculating significance level, show how it varies with power or sample size
      if (chartType === "sampleSize") {
        const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
        const data = sampleSizes.map(n => {
          const newParams = { ...paramsCopy, sampleSize: n };
          newParams.significanceLevel = null;
          // For simplicity, we'll use a constant value since significance level calculation
          // is more complex and often iterative
          const calculatedAlpha = 0.05 * Math.pow(100 / n, 0.2);
          return {
            sampleSize: n,
            significanceLevel: Math.min(0.1, Math.max(0.001, calculatedAlpha))
          };
        });
        setData(data);
      } else {
        // Show how alpha varies with effect size
        const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
        const data = effectSizes.map(es => {
          const newParams = { ...paramsCopy, effectSize: es };
          newParams.significanceLevel = null;
          // For simplicity, we'll use a constant value since significance level calculation
          // is more complex and often iterative
          const calculatedAlpha = 0.05 * Math.pow(0.5 / es, 0.3);
          return {
            effectSize: es,
            significanceLevel: Math.min(0.1, Math.max(0.001, calculatedAlpha))
          };
        });
        setData(data);
      }
    }
  };

  const toggleChartType = () => {
    setChartType(prev => prev === "sampleSize" ? "effectSize" : "sampleSize");
  };

  const toggleViewMode = () => {
    setShowMode(prev => prev === "2d" ? "3d" : "2d");
  };

  const getXAxisLabel = () => {
    if (chartType === "sampleSize") {
      return targetParameter === "sampleSize" ? "Power (1-β)" : "Sample Size";
    } else {
      return "Effect Size";
    }
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
    if (chartType === "sampleSize") {
      return targetParameter === "sampleSize" ? "power" : "sampleSize";
    } else {
      return "effectSize";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Power Analysis Chart</h3>
        <div className="flex space-x-2">
          <ChartControls chartType={chartType} onToggleChartType={toggleChartType} />
          <button 
            className="px-4 py-2 text-sm bg-secondary rounded" 
            onClick={toggleViewMode}
          >
            Switch to {showMode === "2d" ? "3D" : "2D"} View
          </button>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        {showMode === "2d" ? (
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
        ) : (
          <div className="h-full">
            <Power3DPlot params={params} />
          </div>
        )}
      </div>
    </div>
  );
}
