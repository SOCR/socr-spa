/**
 * Simulation Heatmap Visualization
 */

import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationResult } from '@/types/simulation-power';

interface SimulationHeatmapProps {
  results: SimulationResult[];
}

export function SimulationHeatmap({ results }: SimulationHeatmapProps) {
  const { x, y, z, annotations } = useMemo(() => {
    const sampleSizes = [...new Set(results.map(r => r.sampleSize))].sort((a, b) => a - b);
    const domainShifts = [...new Set(results.map(r => r.domainShift))].sort((a, b) => a - b);
    
    // Create 2D array for heatmap
    const z: number[][] = [];
    const annotations: any[] = [];
    
    for (let j = 0; j < domainShifts.length; j++) {
      const row: number[] = [];
      
      for (let i = 0; i < sampleSizes.length; i++) {
        const result = results.find(
          r => r.sampleSize === sampleSizes[i] && r.domainShift === domainShifts[j]
        );
        const power = result ? result.successRate : 0;
        row.push(power);
        
        // Add text annotation
        annotations.push({
          x: sampleSizes[i],
          y: domainShifts[j],
          text: `${(power * 100).toFixed(0)}%`,
          font: {
            size: 10,
            color: power > 0.5 ? 'white' : 'black'
          },
          showarrow: false
        });
      }
      
      z.push(row);
    }
    
    return {
      x: sampleSizes,
      y: domainShifts,
      z,
      annotations
    };
  }, [results]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Power Heatmap</CardTitle>
        <CardDescription>
          Power estimates across all sample sizes and domain shifts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Plot
            data={[
              {
                type: 'heatmap',
                x: x,
                y: y,
                z: z,
                colorscale: [
                  [0, '#fee2e2'],      // red-100
                  [0.4, '#fef3c7'],    // amber-100
                  [0.6, '#fef9c3'],    // yellow-100
                  [0.8, '#d1fae5'],    // green-100
                  [1, '#059669']       // green-600
                ],
                zmin: 0,
                zmax: 1,
                colorbar: {
                  title: 'Power',
                  tickformat: '.0%',
                  thickness: 15
                },
                hovertemplate:
                  'Sample Size: %{x}<br>' +
                  'Domain Shift: %{y:.2f}<br>' +
                  'Power: %{z:.1%}<extra></extra>'
              }
            ]}
            layout={{
              autosize: true,
              margin: { l: 80, r: 50, b: 80, t: 30 },
              xaxis: {
                title: 'Sample Size (n)',
                tickfont: { size: 11 }
              },
              yaxis: {
                title: 'Domain Shift (MMD)',
                tickfont: { size: 11 }
              },
              annotations: annotations
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              modeBarButtonsToRemove: ['lasso2d', 'select2d']
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fee2e2' }} />
            <span>&lt;40% (Low)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fef3c7' }} />
            <span>40-60%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fef9c3' }} />
            <span>60-80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d1fae5' }} />
            <span>80-90%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }} />
            <span>&gt;90% (High)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
