import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { PowerParameters } from '@/types/power-analysis';
import { calculateScientificPower } from '@/utils/scientificPowerCalculations';

interface Power3DPlotProps {
  params: PowerParameters;
}

export function Power3DPlot({ params }: Power3DPlotProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    generatePlotData();
  }, [params]);

  const generatePlotData = () => {
    // Create ranges for power and sample size
    const powers = Array.from({ length: 20 }, (_, i) => 0.5 + (i * 0.025)); // 0.5 to 0.975
    const sampleSizes = Array.from({ length: 20 }, (_, i) => (i + 1) * 10); // 10 to 200
    
    // Calculate effect sizes for each combination
    const z: number[][] = [];
    const x: number[] = [];
    const y: number[] = [];
    
    powers.forEach(power => {
      const row: number[] = [];
      sampleSizes.forEach(size => {
        const newParams = { 
          ...params,
          power: power,
          sampleSize: size,
          effectSize: null 
        };
        
        // We're keeping the original test type and significance level
        // but varying power and sample size to see effect size changes
        let effectSize: number | null = null;
        
        try {
          // For each power and sample size combination, calculate what effect size would be needed
          if (power && size && params.significanceLevel) {
            // We'll iterate until we find an effect size that gives us approximately the target power
            let low = 0.01;
            let high = 2.0;
            let mid = (low + high) / 2;
            let iterations = 0;
            const maxIterations = 10;
            
            // Binary search to find the effect size
            while (iterations < maxIterations) {
              const testParams = {
                ...params,
                power: null,
                sampleSize: size,
                effectSize: mid
              };
              const calculatedPower = calculateScientificPower(testParams);
              
              if (calculatedPower === null) {
                break;
              }
              
              if (Math.abs(calculatedPower - power) < 0.01) {
                // Close enough
                effectSize = mid;
                break;
              } else if (calculatedPower < power) {
                low = mid;
              } else {
                high = mid;
              }
              
              mid = (low + high) / 2;
              iterations++;
            }
            
            if (iterations === maxIterations) {
              effectSize = mid; // Use best estimate
            }
          }
        } catch (error) {
          console.error("Error calculating effect size:", error);
        }
        
        row.push(effectSize || 0);
      });
      
      z.push(row);
      x.push(power);
    });
    
    sampleSizes.forEach(size => {
      y.push(size);
    });
    
    // Create the plot data
    const plotData = [
      {
        type: 'surface',
        x: x,
        y: y,
        z: z,
        colorscale: 'Viridis',
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: "#42f462",
            project: { z: true }
          }
        },
        hovertemplate: 
          'Power: %{x:.3f}<br>' +
          'Sample Size: %{y}<br>' +
          'Effect Size: %{z:.3f}<extra></extra>'
      }
    ];
    
    setPlotData(plotData);
    
    const layout = {
      title: 'Power Analysis 3D Visualization',
      scene: {
        xaxis: { title: 'Statistical Power (1-β)' },
        yaxis: { title: 'Sample Size (n)' },
        zaxis: { title: 'Effect Size (Cohen\'s d)' },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1 }
        }
      },
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 50,
        pad: 0
      },
      autosize: true,
      height: 400
    };
    
    setLayout(layout);
  };

  return (
    <div className="w-full h-full border border-gray-200 rounded-md bg-white">
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true }}
      />
    </div>
  );
}
