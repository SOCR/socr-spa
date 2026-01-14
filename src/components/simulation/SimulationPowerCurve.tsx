/**
 * Power Curve Chart for Simulation Results
 */

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationResult } from '@/types/simulation-power';

interface SimulationPowerCurveProps {
  results: SimulationResult[];
  selectedShift: string;
}

const COLORS = [
  'hsl(220, 70%, 50%)',
  'hsl(160, 70%, 45%)',
  'hsl(280, 70%, 50%)',
  'hsl(30, 70%, 50%)',
  'hsl(350, 70%, 50%)',
  'hsl(180, 70%, 45%)',
];

export function SimulationPowerCurve({ results, selectedShift }: SimulationPowerCurveProps) {
  const { chartData, shifts } = useMemo(() => {
    const shifts = [...new Set(results.map(r => r.domainShift))].sort((a, b) => a - b);
    const sampleSizes = [...new Set(results.map(r => r.sampleSize))].sort((a, b) => a - b);
    
    const chartData = sampleSizes.map(n => {
      const point: any = { sampleSize: n };
      
      for (const shift of shifts) {
        const result = results.find(r => r.sampleSize === n && r.domainShift === shift);
        if (result) {
          point[`power_${shift.toFixed(2)}`] = result.successRate;
          point[`ci_lower_${shift.toFixed(2)}`] = result.confidenceInterval.lower;
          point[`ci_upper_${shift.toFixed(2)}`] = result.confidenceInterval.upper;
          point[`mean_metric_${shift.toFixed(2)}`] = result.meanMetric;
        }
      }
      
      return point;
    });
    
    return { chartData, shifts };
  }, [results]);

  const visibleShifts = selectedShift === 'all' 
    ? shifts 
    : shifts.filter(s => s.toFixed(2) === selectedShift);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Power vs. Sample Size</CardTitle>
        <CardDescription>
          Estimated power for different domain shift magnitudes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="sampleSize" 
                label={{ value: 'Sample Size (n)', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                domain={[0, 1]} 
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                label={{ value: 'Power', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name.startsWith('power_')) {
                    const shift = name.replace('power_', '');
                    return [`${(value * 100).toFixed(1)}%`, `MMD=${shift}`];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Sample Size: ${label}`}
              />
              <Legend 
                formatter={(value) => {
                  if (value.startsWith('power_')) {
                    return `MMD = ${value.replace('power_', '')}`;
                  }
                  return value;
                }}
              />
              
              {/* Reference line at 80% power */}
              <ReferenceLine 
                y={0.8} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5" 
                label={{ value: '80%', position: 'right', fill: 'hsl(var(--destructive))' }}
              />
              
              {visibleShifts.map((shift, idx) => (
                <Line
                  key={shift}
                  type="monotone"
                  dataKey={`power_${shift.toFixed(2)}`}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={`power_${shift.toFixed(2)}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend explanation */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Interpretation:</strong> Higher domain shift (MMD) means greater difference between source and target distributions, 
            leading to reduced transfer performance and requiring larger sample sizes to achieve adequate power.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
