import React, { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import { PowerParameters } from "@/types/power-analysis";
import { calculateScientificPower } from "@/utils/powerAnalysis";
import { Maximize2, Minimize2 } from "lucide-react";

interface Power3DPlotProps {
  params: PowerParameters;
}

export function Power3DPlot({ params }: Power3DPlotProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized surface generation for performance
  const surfaceData = useMemo(() => {
    if (!params.test) return null;
    
    setIsLoading(true);
    
    // Generate arrays for power and sample size
    const powerValues = Array.from({ length: 15 }, (_, i) => 0.1 + i * 0.05); // 0.1 to 0.8
    const sampleSizes = Array.from({ length: 15 }, (_, i) => 10 + i * 10); // 10 to 150
    
    // Initialize effect size matrix
    const effectSizeMatrix = Array(powerValues.length).fill(null).map(() => Array(sampleSizes.length));
    
    // Calculate effect sizes using direct mathematical calculation
    for (let i = 0; i < powerValues.length; i++) {
      for (let j = 0; j < sampleSizes.length; j++) {
        const targetPower = powerValues[i];
        const sampleSize = sampleSizes[j];
        
        // Create parameters for effect size calculation
        const calcParams = {
          ...params,
          power: targetPower,
          sampleSize: sampleSize,
          effectSize: null,
          significanceLevel: params.significanceLevel || 0.05
        };
        
        // Apply test-specific parameter adjustments
        switch (params.test) {
          case "multiple-regression":
          case "set-correlation":
            calcParams.predictors = params.predictors || 3;
            if (params.test === "set-correlation") {
              calcParams.responseVariables = params.responseVariables || 2;
            }
            break;
          case "anova":
          case "anova-two-way":
            calcParams.groups = params.groups || 3;
            if (params.test === "anova-two-way") {
              calcParams.observations = params.observations || 2;
            }
            break;
          case "multivariate":
            calcParams.groups = params.groups || 2;
            calcParams.responseVariables = params.responseVariables || 2;
            break;
          case "sem":
            calcParams.degreesOfFreedom = params.degreesOfFreedom || 10;
            break;
          case "ttest-paired":
            calcParams.correlation = params.correlation || 0.5;
            break;
          case "chi-square-gof":
          case "chi-square-contingency":
            calcParams.groups = params.groups || 2;
            if (params.test === "chi-square-contingency") {
              calcParams.observations = params.observations || 2;
            }
            break;
        }
        
        // Calculate effect size using direct mathematical approach
        const effectSize = calculateEffectSizeDirectly(calcParams);
        effectSizeMatrix[i][j] = effectSize !== null && effectSize > 0 ? effectSize : 0.01;
      }
    }
    
    setIsLoading(false);
    
    return {
      powerValues,
      sampleSizes,
      effectSizeMatrix
    };
  }, [params]);

  // Direct effect size calculation without binary search
  const calculateEffectSizeDirectly = (calcParams: PowerParameters): number | null => {
    const { test, sampleSize, power, significanceLevel, tailType } = calcParams;
    
    if (!sampleSize || !power || !significanceLevel) return null;
    
    const n = sampleSize;
    const targetPower = power;
    const alpha = significanceLevel;
    
    let effectSize: number;
    
    // Direct mathematical calculation based on test type
    switch (test) {
      case "ttest-one-sample":
        // Direct formula: d = (z_β - z_α) / sqrt(n)
        const zAlpha1 = tailType === "one" ? 1.645 : 1.96;
        const zBeta1 = -0.84; // For 80% power
        effectSize = (zBeta1 - (-zAlpha1)) / Math.sqrt(n);
        break;
        
      case "ttest-two-sample":
        // Direct formula for two-sample t-test
        const zAlpha2 = tailType === "one" ? 1.645 : 1.96;
        const zBeta2 = -0.84;
        effectSize = (zBeta2 - (-zAlpha2)) / Math.sqrt(n / 2);
        break;
        
      case "correlation":
        // Fisher's Z transformation
        const zAlpha3 = tailType === "one" ? 1.645 : 1.96;
        const zBeta3 = -0.84;
        const fisherZ = (zAlpha3 + Math.abs(zBeta3)) / Math.sqrt(n - 3);
        effectSize = Math.tanh(fisherZ); // Convert back to correlation
        break;
        
      case "anova":
        // Cohen's f calculation
        const groups = calcParams.groups || 3;
        const dfBetween = groups - 1;
        const dfWithin = n - groups;
        const fCrit = 2.5; // Approximation for F-critical
        effectSize = Math.sqrt(fCrit * dfBetween / n);
        break;
        
      case "linear-regression":
        // f² calculation
        const df1 = calcParams.predictors || 1;
        const df2 = n - df1 - 1;
        effectSize = 0.15 / (1 + 0.15); // Medium effect size approximation
        break;
        
      case "multiple-regression":
        // Multiple regression f² calculation
        const predictors = calcParams.predictors || 3;
        const dfError = n - predictors - 1;
        effectSize = Math.max(0.02, 0.15 * Math.sqrt(predictors / n));
        break;
        
      case "sem":
        // RMSEA calculation
        const df = calcParams.degreesOfFreedom || 10;
        effectSize = Math.sqrt(2.7 / (n - 1)) * Math.sqrt(df); // Approximation
        break;
        
      default:
        // Generic approximation
        effectSize = Math.sqrt(2.7 / Math.sqrt(n));
    }
    
    return Math.max(0.01, Math.min(2.0, Math.abs(effectSize)));
  };

  useEffect(() => {
    if (!surfaceData) return;
    
    const { powerValues, sampleSizes, effectSizeMatrix } = surfaceData;
    
    // Create 3D surface plot data
    const data = [{
      type: 'surface' as const,
      x: sampleSizes,
      y: powerValues,
      z: effectSizeMatrix,
      colorscale: 'Viridis',
      showscale: true,
      colorbar: {
        title: 'Effect Size',
        titleside: 'right'
      },
      contours: {
        z: {
          show: true,
          usecolormap: true,
          highlightcolor: "#42f462",
          project: { z: true }
        }
      }
    }];

    const newLayout = {
      title: {
        text: '3D Power Analysis Surface',
        font: { size: isFullScreen ? 20 : 16 }
      },
      scene: {
        xaxis: { 
          title: 'Sample Size',
          titlefont: { size: isFullScreen ? 16 : 12 }
        },
        yaxis: { 
          title: 'Statistical Power',
          titlefont: { size: isFullScreen ? 16 : 12 }
        },
        zaxis: { 
          title: 'Effect Size',
          titlefont: { size: isFullScreen ? 16 : 12 }
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 }
        }
      },
      margin: { l: 0, r: 0, b: 0, t: isFullScreen ? 60 : 40 },
      autosize: true
    };

    setPlotData(data);
    setLayout(newLayout);
  }, [surfaceData, isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!params.test) {
    return <div className="text-center text-gray-500 py-8">Please select a statistical test to view the 3D surface.</div>;
  }

  return (
    <div className={`${isFullScreen ? 'fixed top-0 left-0 z-50 w-screen h-screen bg-white' : 'relative'}`}>
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleFullScreen}
          className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm"
          title={isFullScreen ? "Exit fullscreen" : "View fullscreen"}
        >
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Generating 3D surface...</div>
          </div>
        </div>
      )}
      
      <div className={`${isFullScreen ? 'w-full h-full p-4' : 'w-full h-full'}`}>
        <Plot
          data={plotData}
          layout={layout}
          config={{
            displayModeBar: isFullScreen,
            responsive: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}