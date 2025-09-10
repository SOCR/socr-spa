import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Info } from "lucide-react";

export function PowerAnalysisGuideSimple() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Power Analysis Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cohen's Effect Size Conventions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">T-Tests (Cohen's d)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Small:</span>
                      <Badge variant="outline">0.2</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium:</span>
                      <Badge variant="outline">0.5</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Large:</span>
                      <Badge variant="outline">0.8</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">ANOVA (Cohen's f)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Small:</span>
                      <Badge variant="outline">0.1</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium:</span>
                      <Badge variant="outline">0.25</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Large:</span>
                      <Badge variant="outline">0.4</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Power Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Power = 0.8:</span>
                    <Badge>Standard</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Conventional minimum acceptable power</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alpha = 0.05:</span>
                    <Badge>Typical</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Standard significance level</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sample size:</span>
                    <Badge variant="outline">Context-dependent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Depends on effect size and power requirements</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Start:</strong> For most studies, aim for 80% power (0.8) with α = 0.05. 
              Use effect size estimates from literature or pilot studies when available.
            </AlertDescription>
          </Alert>

          <div className="prose max-w-none text-sm">
            <h3>Key Concepts</h3>
            <ul className="space-y-2">
              <li><strong>Statistical Power:</strong> Probability of detecting a true effect when it exists</li>
              <li><strong>Effect Size:</strong> Standardized measure of the magnitude of an effect</li>
              <li><strong>Sample Size:</strong> Number of observations needed for adequate power</li>
              <li><strong>Alpha Level:</strong> Probability of Type I error (false positive)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}