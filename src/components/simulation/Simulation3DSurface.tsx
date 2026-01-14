/**
 * 3D Power Surface Plot using Plotly
 */

import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationResult } from '@/types/simulation-power';

interface Simulation3DSurfaceProps {
  results: SimulationResult[];
}

export function Simulation3DSurface({ results }: Simulation3DSurfaceProps) {
  const { x, y, z, zCI } = useMemo(() => {
    const sampleSizes = [...new Set(results.map(r => r.sampleSize))].sort((a, b) => a - b);
    const domainShifts = [...new Set(results.map(r => r.domainShift))].sort((a, b) => a - b);
    
    // Create 2D arrays for surface
    const z: number[][] = [];
    const zCI: number[][] = []; // CI width
    
    for (const shift of domainShifts) {
      const row: number[] = [];
      const ciRow: number[] = [];
      
      for (const n of sampleSizes) {
        const result = results.find(r => r.sampleSize === n && r.domainShift === shift);
        row.push(result ? result.successRate : 0);
        ciRow.push(result ? (result.confidenceInterval.upper - result.confidenceInterval.lower) / 2 : 0);
      }
      
      z.push(row);
      zCI.push(ciRow);
    }
    
    return {
      x: sampleSizes,
      y: domainShifts,
      z,
      zCI
    };
  }, [results]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">3D Power Surface</CardTitle>
        <CardDescription>
          Interactive visualization of power across sample size and domain shift
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <Plot
            data={[
              {
                type: 'surface',
                x: x,
                y: y,
                z: z,
                colorscale: 'Viridis',
                colorbar: {
                  title: 'Power',
                  tickformat: '.0%'
                },
                contours: {
                  z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: '#fff',
                    project: { z: true }
                  }
                },
                hovertemplate:
                  'Sample Size: %{x}<br>' +
                  'Domain Shift (MMD): %{y:.2f}<br>' +
                  'Estimated Power: %{z:.1%}<extra></extra>'
              },
              // Add 80% power plane
              {
                type: 'surface',
                x: x,
                y: y,
                z: y.map(() => x.map(() => 0.8)),
                opacity: 0.3,
                showscale: false,
                colorscale: [[0, 'red'], [1, 'red']],
                hoverinfo: 'skip'
              }
            ]}
            layout={{
              autosize: true,
              margin: { l: 0, r: 0, b: 0, t: 30 },
              scene: {
                xaxis: {
                  title: 'Sample Size (n)',
                  tickfont: { size: 10 }
                },
                yaxis: {
                  title: 'Domain Shift (MMD)',
                  tickfont: { size: 10 }
                },
                zaxis: {
                  title: 'Power',
                  range: [0, 1],
                  tickformat: '.0%',
                  tickfont: { size: 10 }
                },
                camera: {
                  eye: { x: 1.5, y: 1.5, z: 1 }
                }
              },
              annotations: [
                {
                  text: '80% Power Threshold (red plane)',
                  showarrow: false,
                  x: 0.5,
                  y: 1.02,
                  xref: 'paper',
                  yref: 'paper',
                  font: { size: 11, color: 'red' }
                }
              ]
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              modeBarButtonsToRemove: ['lasso2d', 'select2d']
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Tips:</strong> Click and drag to rotate. Scroll to zoom. The red transparent plane indicates the 80% power threshold.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
