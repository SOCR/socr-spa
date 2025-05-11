
import { useState, useEffect } from "react";
import { PowerParameters } from "@/types/power-analysis";
import { 
  calculateScientificPower, 
  calculateScientificSampleSize, 
  calculateScientificEffectSize, 
  calculateScientificSignificanceLevel 
} from "@/utils/scientificPowerCalculations";

export const usePowerCalculation = (
  params: PowerParameters,
  targetParameter: keyof Omit<PowerParameters, "test">
) => {
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);

  useEffect(() => {
    try {
      const paramsCopy = { ...params };
      (paramsCopy[targetParameter] as any) = null;
      
      let result: number | null = null;
      
      switch (targetParameter) {
        case "power":
          result = calculateScientificPower(paramsCopy);
          break;
        case "sampleSize":
          result = calculateScientificSampleSize(paramsCopy);
          break;
        case "effectSize":
          result = calculateScientificEffectSize(paramsCopy);
          break;
        case "significanceLevel":
          result = calculateScientificSignificanceLevel(paramsCopy);
          break;
      }
      
      setCalculatedValue(result);
    } catch (error) {
      console.error("Error in power calculation:", error);
      setCalculatedValue(null);
    }
  }, [params, targetParameter]);

  return calculatedValue;
};
