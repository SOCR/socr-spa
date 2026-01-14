/**
 * Simulation Results Component
 * Displays comprehensive results from simulation-based power analysis
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileJson, FileSpreadsheet, Code, BarChart3, LineChart, Grid3X3 } from 'lucide-react';
import type { SimulationResult, SimulationConfig } from '@/types/simulation-power';
import { exportToCSV, exportToJSON, generateRCode, generatePythonCode, downloadFile } from '@/utils/simulation/export';
import { SimulationPowerCurve } from './SimulationPowerCurve';
import { Simulation3DSurface } from './Simulation3DSurface';
import { SimulationHeatmap } from './SimulationHeatmap';
import { SimulationSummary } from './SimulationSummary';

interface SimulationResultsProps {
  results: SimulationResult[];
  config: SimulationConfig;
}

export function SimulationResults({ results, config }: SimulationResultsProps) {
  const [selectedShift, setSelectedShift] = useState<string>('all');
  
  // Get unique domain shifts
  const domainShifts = [...new Set(results.map(r => r.domainShift))].sort((a, b) => a - b);
  
  // Filter results by selected shift
  const filteredResults = selectedShift === 'all' 
    ? results 
    : results.filter(r => r.domainShift.toFixed(2) === selectedShift);

  const handleExport = (format: 'csv' | 'json' | 'r' | 'python') => {
    switch (format) {
      case 'csv':
        downloadFile(exportToCSV(results), 'simulation-power-results.csv', 'text/csv');
        break;
      case 'json':
        downloadFile(exportToJSON(results, config), 'simulation-power-results.json', 'application/json');
        break;
      case 'r':
        downloadFile(generateRCode(config), 'simulation-power-analysis.R', 'text/plain');
        break;
      case 'python':
        downloadFile(generatePythonCode(config), 'simulation-power-analysis.py', 'text/plain');
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Simulation Results
            </CardTitle>
            <CardDescription>
              Power estimates from {results.reduce((sum, r) => sum + r.simulations.length, 0).toLocaleString()} total simulations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by MMD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domain Shifts</SelectItem>
                {domainShifts.map(shift => (
                  <SelectItem key={shift} value={shift.toFixed(2)}>
                    MMD = {shift.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <SimulationSummary results={results} config={config} />

        {/* Visualization Tabs */}
        <Tabs defaultValue="curve" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curve" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Power Curves
            </TabsTrigger>
            <TabsTrigger value="surface" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              3D Surface
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Heatmap
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="curve" className="mt-4">
            <SimulationPowerCurve results={results} selectedShift={selectedShift} />
          </TabsContent>
          
          <TabsContent value="surface" className="mt-4">
            <Simulation3DSurface results={results} />
          </TabsContent>
          
          <TabsContent value="heatmap" className="mt-4">
            <SimulationHeatmap results={results} />
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Export Results</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
              <FileJson className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('r')}>
              <Code className="h-4 w-4 mr-2" />
              R Code
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('python')}>
              <Code className="h-4 w-4 mr-2" />
              Python Code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
