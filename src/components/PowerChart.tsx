
import React, { useState, useEffect } from "react";
import { PowerParameters } from "@/types/power-analysis";
import { ChartControls } from "@/components/ChartControls";
import { Power3DPlot } from "@/components/Power3DPlotOptimized";
import { ChartFullscreenButton } from "@/components/charts/ChartFullscreenButton";
import { PowerCurveChart } from "@/components/charts/PowerCurveChart";
import { generateChartData, getChartConfiguration } from "@/components/charts/PowerChartGenerator";

interface PowerChartProps {
  params: PowerParameters;
  targetParameter: keyof Omit<PowerParameters, "test">;
}

export function PowerChart({ params, targetParameter }: PowerChartProps) {
  const [data, setData] = useState<Array<{[key: string]: number}>>([]);
  const [chartType, setChartType] = useState<"sampleSize" | "effectSize">("sampleSize");
  const [is2DFullScreen, setIs2DFullScreen] = useState<boolean>(false);

  useEffect(() => {
    console.log("Generating chart data with:", { params, targetParameter, chartType });
    const chartData = generateChartData(params, targetParameter, chartType);
    setData(chartData);
  }, [params, targetParameter, chartType]);

  const toggleChartType = () => {
    setChartType(prev => prev === "sampleSize" ? "effectSize" : "sampleSize");
  };

  const toggle2DFullScreen = () => {
    setIs2DFullScreen(!is2DFullScreen);
  };

  const { xAxisLabel, yAxisLabel, lineDataKey, xAxisDataKey } = getChartConfiguration(targetParameter, chartType);

  return (
    <div className="space-y-6">
      {/* 2D Chart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Power Analysis Chart (2D)</h3>
          <div className="flex items-center gap-2">
            <ChartControls chartType={chartType} onToggleChartType={toggleChartType} />
            <ChartFullscreenButton isFullScreen={is2DFullScreen} toggleFullScreen={toggle2DFullScreen} />
          </div>
        </div>
        
        <div 
          className={`${is2DFullScreen ? 'fixed top-0 left-0 z-50 w-screen h-screen bg-white p-8' : 'h-64 sm:h-80 border rounded-md bg-white p-4'}`}
        >
          {is2DFullScreen && (
            <div className="absolute top-4 right-4 z-50">
              <ChartFullscreenButton isFullScreen={is2DFullScreen} toggleFullScreen={toggle2DFullScreen} />
            </div>
          )}
          <PowerCurveChart 
            data={data}
            xAxisDataKey={xAxisDataKey}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            lineDataKey={lineDataKey}
            isFullScreen={is2DFullScreen}
          />
        </div>
      </div>
      
      {/* 3D Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">3D Power Analysis Surface</h3>
        <div className="h-80 border rounded-md bg-white p-2">
          <Power3DPlot params={params} />
        </div>
        <p className="text-sm text-gray-500">
          This 3D surface shows the relationship between statistical power (X-axis), 
          sample size (Y-axis), and effect size (Z-axis/height).
        </p>
      </div>
    </div>
  );
}
