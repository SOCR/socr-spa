import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PowerParameters } from "@/types/power-analysis";
import { 
  calculatePower, 
  calculateSampleSize, 
  calculateEffectSize, 
  calculateSignificanceLevel 
} from "@/utils/power-calculations";
import { ChartControls } from "@/components/ChartControls";

interface PowerChartProps {
  params: PowerParameters;
  targetParameter: keyof Omit<PowerParameters, "test">;
}

// Helper functions moved to separate utils file
const generatePowerCurve = (params: PowerParameters, sampleSizes: number[]): Array<{sampleSize: number; power: number}> => {
  return sampleSizes.map(n => {
    const newParams = { ...params, sampleSize: n };
    newParams.power = null;
    const calculatedPower = calculatePower(newParams);
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
    const calculatedPower = calculatePower(newParams);
    return {
      effectSize: es,
      power: calculatedPower || 0
    };
  });
};

export function PowerChart({ params, targetParameter }: PowerChartProps) {
  const [data, setData] = useState<Array<{[key: string]: number}>>([]);
  const [chartType, setChartType] = useState<"sampleSize" | "effectSize">("sampleSize");

  useEffect(() => {
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

  const getXAxisLabel = () => chartType === "sampleSize" ? "Sample Size" : "Effect Size";
  
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
  
  const getXAxisDataKey = () => chartType === "sampleSize" ? "sampleSize" : "effectSize";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Power Analysis Chart</h3>
      
      <ChartControls chartType={chartType} onToggleChartType={toggleChartType} />
      
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
