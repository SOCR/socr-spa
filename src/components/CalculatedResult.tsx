
import React from "react";

interface CalculatedResultProps {
  targetParameter: string;
  value: number | null;
}

export function CalculatedResult({ targetParameter, value }: CalculatedResultProps) {
  return (
    <div className="bg-muted p-4 rounded-md">
      <h3 className="text-lg font-medium mb-2">Calculated {targetParameter}</h3>
      <div className="text-4xl font-bold text-primary">
        {value !== null ? (
          targetParameter === "sampleSize" 
            ? Math.ceil(value) 
            : value.toFixed(
                targetParameter === "significanceLevel" || targetParameter === "power" 
                  ? 3 
                  : 2
              )
        ) : 'N/A'}
      </div>
    </div>
  );
}
