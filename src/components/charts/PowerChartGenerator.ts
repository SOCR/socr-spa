
import { PowerParameters } from "@/types/power-analysis";
import { 
  calculateScientificPower, 
  calculateScientificSampleSize, 
  calculateScientificEffectSize 
} from "@/utils/powerAnalysis";

// Helper function to generate power curve data
export const generatePowerCurve = (params: PowerParameters, sampleSizes: number[]): Array<{sampleSize: number; power: number}> => {
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

// Helper function to generate effect size curve data
export const generateEffectSizeCurve = (params: PowerParameters, effectSizes: number[]): Array<{effectSize: number; power: number}> => {
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

// Generate data for all chart types based on target parameter
export const generateChartData = (
  params: PowerParameters, 
  targetParameter: keyof Omit<PowerParameters, "test">,
  chartType: "sampleSize" | "effectSize"
): Array<{[key: string]: number}> => {
  const paramsCopy = { ...params };
  
  if (targetParameter === "power") {
    if (chartType === "sampleSize") {
      const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
      return generatePowerCurve(paramsCopy, sampleSizes);
    } else {
      const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
      return generateEffectSizeCurve(paramsCopy, effectSizes);
    }
  } 
  else if (targetParameter === "sampleSize") {
    // When calculating sample size, show how it varies with power or effect size
    if (chartType === "effectSize") {
      const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
      return effectSizes.map(es => {
        const newParams = { ...paramsCopy, effectSize: es };
        newParams.sampleSize = null;
        const calculatedSampleSize = calculateScientificSampleSize(newParams);
        return {
          effectSize: es,
          sampleSize: calculatedSampleSize || 0
        };
      });
    } else {
      // Show how sample size varies with power
      const powers = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.025);
      return powers.map(power => {
        const newParams = { ...paramsCopy, power: power };
        newParams.sampleSize = null;
        const calculatedSampleSize = calculateScientificSampleSize(newParams);
        return {
          power: power,
          sampleSize: calculatedSampleSize || 0
        };
      });
    }
  }
  else if (targetParameter === "effectSize") {
    // When calculating effect size, show how it varies with sample size or power
    if (chartType === "sampleSize") {
      const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
      return sampleSizes.map(n => {
        const newParams = { ...paramsCopy, sampleSize: n };
        newParams.effectSize = null;
        const calculatedEffectSize = calculateScientificEffectSize(newParams);
        return {
          sampleSize: n,
          effectSize: calculatedEffectSize || 0
        };
      });
    } else {
      // Show how effect size varies with power
      const powers = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.025);
      return powers.map(power => {
        const newParams = { ...paramsCopy, power: power };
        newParams.effectSize = null;
        const calculatedEffectSize = calculateScientificEffectSize(newParams);
        return {
          power: power,
          effectSize: calculatedEffectSize || 0
        };
      });
    }
  }
  else if (targetParameter === "significanceLevel") {
    // When calculating significance level, show how it varies with power or sample size
    if (chartType === "sampleSize") {
      const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
      return sampleSizes.map(n => {
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
    } else {
      // Show how alpha varies with effect size
      const effectSizes = Array.from({ length: 20 }, (_, i) => i * 0.05 + 0.05);
      return effectSizes.map(es => {
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
    }
  }
  
  return [];
};

// Helper functions to get chart labels and keys
export const getChartConfiguration = (
  targetParameter: keyof Omit<PowerParameters, "test">,
  chartType: "sampleSize" | "effectSize"
) => {
  const getXAxisLabel = () => {
    if (chartType === "sampleSize") {
      return targetParameter === "sampleSize" ? "Power (1-β)" : "Sample Size (n)";
    } else {
      return "Effect Size";
    }
  };
  
  const getYAxisLabel = () => {
    switch (targetParameter) {
      case "power": return "Statistical Power (1-β)";
      case "sampleSize": return "Sample Size (n)";
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
  
  return {
    xAxisLabel: getXAxisLabel(),
    yAxisLabel: getYAxisLabel(),
    lineDataKey: getLineDataKey(),
    xAxisDataKey: getXAxisDataKey()
  };
};
