
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PowerCurveChartProps {
  data: Array<{[key: string]: number}>;
  xAxisDataKey: string;
  xAxisLabel: string;
  yAxisLabel: string;
  lineDataKey: string;
  isFullScreen: boolean;
}

export function PowerCurveChart({ 
  data, 
  xAxisDataKey, 
  xAxisLabel, 
  yAxisLabel, 
  lineDataKey,
  isFullScreen
}: PowerCurveChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisDataKey} 
          label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -5 }} 
        />
        <YAxis 
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip formatter={(value: number) => value.toFixed(3)} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={lineDataKey} 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
