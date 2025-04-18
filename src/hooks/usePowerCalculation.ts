
import { useState, useEffect } from "react";
import { PowerParameters, StatisticalTest } from "@/types/power-analysis";
import { 
  calculatePower, 
  calculateSampleSize, 
  calculateEffectSize, 
  calculateSignificanceLevel 
} from "@/utils/power-calculations";

export const usePowerCalculation = (
  params: PowerParameters,
  targetParameter: keyof Omit<PowerParameters, "test">
) => {
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);

  useEffect(() => {
    const paramsCopy = { ...params };
    (paramsCopy[targetParameter] as any) = null;
    
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
  }, [params, targetParameter]);

  return calculatedValue;
};
