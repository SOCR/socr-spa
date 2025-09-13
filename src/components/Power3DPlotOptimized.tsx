import React, { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import { PowerParameters } from "@/types/power-analysis";
import { goldStandardPower } from "@/utils/powerAnalysis/gold-standard-calculations";
import { Maximize2, Minimize2 } from "lucide-react";

interface Power3DPlotProps {
  params: PowerParameters;
}

// PHASE 4: Test-specific effect size and sample size ranges
const getTestRanges = (testType: string) => {
  switch (testType) {
    case "ttest-one-sample":
    case "ttest-two-sample":
    case "ttest-paired":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.1 + i * 0.12), // Cohen's d: 0.1 to 1.8
        sampleSizes: Array.from({ length: 15 }, (_, i) => 10 + i * 15), // n: 10 to 220
        effectSizeLabel: "Cohen's d"
      };
    
    case "anova":
    case "anova-two-way":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.1 + i * 0.08), // Cohen's f: 0.1 to 1.22
        sampleSizes: Array.from({ length: 15 }, (_, i) => 20 + i * 25), // n: 20 to 370
        effectSizeLabel: "Cohen's f"
      };
    
    case "correlation":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.1 + i * 0.06), // r: 0.1 to 0.94
        sampleSizes: Array.from({ length: 15 }, (_, i) => 15 + i * 20), // n: 15 to 295
        effectSizeLabel: "Correlation (r)"
      };
    
    case "multiple-regression":
    case "linear-regression":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.02 + i * 0.04), // f²: 0.02 to 0.58
        sampleSizes: Array.from({ length: 15 }, (_, i) => 20 + i * 15), // n: 20 to 230
        effectSizeLabel: "f²"
      };
    
    case "proportion-test":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.2 + i * 0.08), // Cohen's h: 0.2 to 1.32
        sampleSizes: Array.from({ length: 15 }, (_, i) => 15 + i * 12), // n: 15 to 183
        effectSizeLabel: "Cohen's h"
      };
    
    case "chi-square-gof":
    case "chi-square-contingency":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.1 + i * 0.06), // Cohen's w: 0.1 to 0.94
        sampleSizes: Array.from({ length: 15 }, (_, i) => 25 + i * 20), // n: 25 to 305
        effectSizeLabel: "Cohen's w"
      };
    
    case "sem":
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.03 + i * 0.01), // RMSEA: 0.03 to 0.17
        sampleSizes: Array.from({ length: 15 }, (_, i) => 50 + i * 25), // n: 50 to 400
        effectSizeLabel: "RMSEA"
      };
    
    default:
      return {
        effectSizes: Array.from({ length: 15 }, (_, i) => 0.1 + i * 0.12),
        sampleSizes: Array.from({ length: 15 }, (_, i) => 10 + i * 15),
        effectSizeLabel: "Effect Size"
      };
  }
};

export function Power3DPlotOptimized({ params }: Power3DPlotProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // PHASE 4: Memoized surface generation with proper test-specific ranges
  const surfaceData = useMemo(() => {
    if (!params.test) return null;
    
    try {
      setIsLoading(true);
      
      // PHASE 4: Get test-specific ranges
      const ranges = getTestRanges(params.test);
      const { sampleSizes, effectSizes } = ranges;
      
      // Initialize power matrix (Z-axis)
      const powerMatrix = Array(sampleSizes.length).fill(null).map(() => Array(effectSizes.length));
      
      // Calculate power values using gold standard methods
      let calculationCount = 0;
      const maxCalculations = sampleSizes.length * effectSizes.length;
      const startTime = Date.now();
      const maxTime = 8000; // 8 second timeout
      
      for (let i = 0; i < sampleSizes.length; i++) {
        for (let j = 0; j < effectSizes.length; j++) {
          calculationCount++;
          
          // Timeout protection
          if (Date.now() - startTime > maxTime) {
            console.warn("3D surface calculation timeout");
            powerMatrix[i][j] = null; // PHASE 4: Use null for failed calculations
            continue;
          }
          
          const sampleSize = sampleSizes[i];
          const effectSize = effectSizes[j];
          
          // Create parameters for power calculation
          const powerCalcParams: PowerParameters = {
            test: params.test,
            sampleSize: sampleSize,
            effectSize: effectSize,
            significanceLevel: params.significanceLevel || 0.05,
            power: null, // We're calculating power
            tailType: params.tailType || "two",
            // Copy test-specific parameters
            groups: params.groups,
            predictors: params.predictors,
            responseVariables: params.responseVariables,
            degreesOfFreedom: params.degreesOfFreedom,
            correlation: params.correlation,
            observations: params.observations
          };
          
          // Calculate power using gold standard methods
          try {
            const power = goldStandardPower(powerCalcParams);
            
            // PHASE 4: Only clamp to [0,1], no heuristic fallbacks
            if (power !== null && !isNaN(power) && isFinite(power)) {
              powerMatrix[i][j] = Math.max(0, Math.min(1, power));
            } else {
              powerMatrix[i][j] = null; // Let Plotly handle gaps in the surface
            }
          } catch (error) {
            console.warn(`Power calculation failed for ${params.test} at n=${sampleSize}, es=${effectSize}:`, error);
            powerMatrix[i][j] = null; // PHASE 4: No fallback approximations
          }
        }
      }
      
      setIsLoading(false);
      
      // PHASE 4: Add current parameter marker
      let currentMarker = null;
      if (params.sampleSize && params.effectSize) {
        try {
          const currentPower = goldStandardPower({
            ...params,
            power: null
          });
          
          if (currentPower !== null && !isNaN(currentPower)) {
            currentMarker = {
              x: params.sampleSize,
              y: params.effectSize,
              z: currentPower
            };
          }
        } catch (error) {
          console.warn("Could not calculate current marker position:", error);
        }
      }
      
      return {
        sampleSizes,
        effectSizes,
        powerMatrix,
        effectSizeLabel: ranges.effectSizeLabel,
        currentMarker
      };
    } catch (error) {
      console.error("Error generating 3D surface data:", error);
      setIsLoading(false);
      return null;
    }
  }, [params]);

  useEffect(() => {
    if (!surfaceData) return;
    
    const { sampleSizes, effectSizes, powerMatrix, effectSizeLabel, currentMarker } = surfaceData;
    
    // Debug logging
    const validPowers = powerMatrix.flat().filter(p => p !== null);
    console.log(`3D Plot Generated for ${params.test}:`, { 
      sampleRange: [Math.min(...sampleSizes), Math.max(...sampleSizes)],
      effectRange: [Math.min(...effectSizes), Math.max(...effectSizes)],
      powerRange: validPowers.length > 0 ? [Math.min(...validPowers), Math.max(...validPowers)] : [null, null],
      validCalculations: validPowers.length,
      totalCalculations: sampleSizes.length * effectSizes.length,
      currentMarker: currentMarker ? `n=${currentMarker.x}, es=${currentMarker.y.toFixed(3)}, power=${currentMarker.z.toFixed(3)}` : "none"
    });
    
    // Create plot data array
    const data = [
      {
        type: 'surface' as const,
        x: sampleSizes, // X-axis: Sample Size
        y: effectSizes, // Y-axis: Effect Size  
        z: powerMatrix, // Z-axis: Power
        colorscale: 'Viridis',
        showscale: true,
        colorbar: {
          title: 'Statistical Power',
          titleside: 'right'
        },
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: "#42f462",
            project: { z: true }
          }
        },
        name: 'Power Surface'
      }
    ];
    
    // PHASE 4: Add current parameter marker
    if (currentMarker) {
      data.push({
        type: 'scatter3d' as const,
        x: [currentMarker.x],
        y: [currentMarker.y],
        z: [currentMarker.z],
        mode: 'markers' as const,
        marker: {
          size: 8,
          color: 'red',
          symbol: 'diamond'
        },
        name: `Current: Power=${currentMarker.z.toFixed(3)}`,
        showlegend: true
      } as any);
    }

    const newLayout = {
      title: {
        text: `3D Power Analysis: ${params.test}`,
        font: { size: isFullScreen ? 20 : 16 }
      },
      scene: {
        xaxis: { 
          title: {
            text: 'Sample Size (n)',
            font: { size: isFullScreen ? 16 : 12, color: '#333' }
          },
          showgrid: true,
          gridcolor: '#e1e5e9',
          showline: true,
          linecolor: '#666',
          tickfont: { size: isFullScreen ? 12 : 10 }
        },
        yaxis: { 
          title: {
            text: effectSizeLabel,
            font: { size: isFullScreen ? 16 : 12, color: '#333' }
          },
          showgrid: true,
          gridcolor: '#e1e5e9',
          showline: true,
          linecolor: '#666',
          tickfont: { size: isFullScreen ? 12 : 10 }
        },
        zaxis: { 
          title: {
            text: 'Statistical Power',
            font: { size: isFullScreen ? 16 : 12, color: '#333' }
          },
          showgrid: true,
          gridcolor: '#e1e5e9',
          showline: true,
          linecolor: '#666',
          tickfont: { size: isFullScreen ? 12 : 10 },
          range: [0, 1]
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 }
        },
        bgcolor: 'rgba(248,249,250,0.8)'
      },
      margin: { l: 0, r: 0, b: 0, t: isFullScreen ? 60 : 40 },
      autosize: true,
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: '#ccc',
        borderwidth: 1
      }
    };

    setPlotData(data);
    setLayout(newLayout);
  }, [surfaceData, isFullScreen, params.test]);

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