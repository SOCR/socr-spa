import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SimpleChartProps {
  data: Array<{[key: string]: number}>;
  xAxisDataKey: string;
  lineDataKey: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

export function SimpleChart({ data, xAxisDataKey, lineDataKey, xAxisLabel, yAxisLabel }: SimpleChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available for chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisDataKey} 
          label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
        />
        <YAxis 
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          formatter={(value) => [Number(value).toFixed(4), yAxisLabel]}
          labelFormatter={(label) => `${xAxisLabel}: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey={lineDataKey} 
          stroke="#2563eb" 
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}