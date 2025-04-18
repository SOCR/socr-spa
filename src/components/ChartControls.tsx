
import React from "react";
import { Button } from "@/components/ui/button";

interface ChartControlsProps {
  chartType: "sampleSize" | "effectSize";
  onToggleChartType: () => void;
}

export function ChartControls({ chartType, onToggleChartType }: ChartControlsProps) {
  return (
    <Button 
      className="px-4 py-2 text-sm bg-secondary rounded"
      onClick={onToggleChartType}
    >
      Show variation with {chartType === "sampleSize" ? "effect size" : "sample size"}
    </Button>
  );
}
