import { useState, useEffect } from "react";
import { PowerParameters } from "@/types/power-analysis";
import { 
  calculateScientificPower, 
  calculateScientificSampleSize, 
  calculateScientificEffectSize, 
  calculateScientificSignificanceLevel 
} from "@/utils/powerAnalysis";

export const usePowerCalculation = (
  params: PowerParameters,
  targetParameter: keyof Omit<PowerParameters, "test">
) => {
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);

  useEffect(() => {
    try {
      // Validate required parameters
      if (!params.test) {
        setCalculatedValue(null);
        return;
      }

      const paramsCopy = { ...params };
      (paramsCopy[targetParameter] as any) = null;
      
      let result: number | null = null;
      
      switch (targetParameter) {
        case "power":
          if (paramsCopy.sampleSize && paramsCopy.effectSize && paramsCopy.significanceLevel) {
            result = calculateScientificPower(paramsCopy);
          }
          break;
        case "sampleSize":
          if (paramsCopy.power && paramsCopy.effectSize && paramsCopy.significanceLevel) {
            result = calculateScientificSampleSize(paramsCopy);
          }
          break;
        case "effectSize":
          if (paramsCopy.power && paramsCopy.sampleSize && paramsCopy.significanceLevel) {
            result = calculateScientificEffectSize(paramsCopy);
          }
          break;
        case "significanceLevel":
          if (paramsCopy.power && paramsCopy.sampleSize && paramsCopy.effectSize) {
            result = calculateScientificSignificanceLevel(paramsCopy);
          }
          break;
      }
      
      // Validate and bound the result with stability checks
      if (result !== null && !isNaN(result) && isFinite(result)) {
        switch (targetParameter) {
          case "power":
          case "significanceLevel":
            result = Math.max(0.001, Math.min(0.999, result));
            // Add stability - round to 3 decimal places to prevent micro-fluctuations
            result = Math.round(result * 1000) / 1000;
            break;
          case "sampleSize":
            result = Math.max(4, Math.round(result));
            // Add stability buffer for sample size calculations
            if (result > 10000) result = 10000; // Cap at reasonable max
            break;
          case "effectSize":
            result = Math.max(0.01, Math.min(5.0, result));
            // Add stability - round to 3 decimal places
            result = Math.round(result * 1000) / 1000;
            break;
        }
      } else {
        result = null; // Invalid calculation result
      }
      
      setCalculatedValue(result);
    } catch (error) {
      console.error(`Error in ${targetParameter} calculation:`, error);
      setCalculatedValue(null);
    }
  }, [params, targetParameter]);

  return calculatedValue;
};