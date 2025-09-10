import React from "react";
import { PowerParameters } from "@/types/power-analysis";
import { calculateScientificPower } from "@/utils/powerAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface CalculationValidatorProps {
  params: PowerParameters;
  calculatedValue: number | null;
  targetParameter: keyof Omit<PowerParameters, "test">;
}

export function CalculationValidator({ params, calculatedValue, targetParameter }: CalculationValidatorProps) {
  // Validate that calculation pipeline is working
  const validateCalculation = () => {
    try {
      // Test basic power calculation
      const testParams: PowerParameters = {
        test: "ttest-two-sample",
        sampleSize: 30,
        effectSize: 0.5,
        significanceLevel: 0.05,
        power: null,
        tailType: "two"
      };
      
      const testPower = calculateScientificPower(testParams);
      
      if (testPower === null || testPower <= 0 || testPower >= 1) {
        return {
          isValid: false,
          message: "Core power calculation function is not working correctly"
        };
      }
      
      // Validate current calculation
      if (calculatedValue === null) {
        return {
          isValid: false,
          message: `Could not calculate ${targetParameter}. Please check your input parameters.`
        };
      }
      
      // Validate ranges
      const validRanges = {
        power: [0.001, 0.999],
        sampleSize: [4, 10000],
        effectSize: [0.001, 5.0],
        significanceLevel: [0.001, 0.5]
      };
      
      const [min, max] = validRanges[targetParameter];
      if (calculatedValue < min || calculatedValue > max) {
        return {
          isValid: false,
          message: `Calculated ${targetParameter} (${calculatedValue.toFixed(4)}) is outside valid range [${min}, ${max}]`
        };
      }
      
      return {
        isValid: true,
        message: `Calculation successful: ${targetParameter} = ${calculatedValue.toFixed(4)}`
      };
      
    } catch (error) {
      return {
        isValid: false,
        message: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  const validation = validateCalculation();
  
  if (!validation.isValid) {
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{validation.message}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="mt-2 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">{validation.message}</AlertDescription>
    </Alert>
  );
}